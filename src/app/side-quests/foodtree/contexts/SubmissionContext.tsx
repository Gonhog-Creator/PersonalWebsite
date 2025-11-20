'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'; // Removed unused useEffect import

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export type SubmissionType = 'ingredient' | 'dish';

export interface SubmissionData {
  name: string;
  [key: string]: unknown; // Allow for additional properties
}

export interface Submission {
  id: string;
  type: SubmissionType;
  data: SubmissionData;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  notes?: string;
}

interface SubmissionContextType {
  submissions: Submission[];
  addSubmission: (type: SubmissionType, data: SubmissionData) => Promise<void>;
  refreshSubmissions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{message: string, itemName: string} | null>(null);

  const addSubmission = useCallback(async (type: SubmissionType, data: SubmissionData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/foodtree/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      });

      let responseData;
      const responseText = await response.text();
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        console.log('[SubmissionContext] Parsed response data:', responseData);
      } catch (e) {
        console.error('[SubmissionContext] Failed to parse JSON response. Response text:', responseText);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        // Handle duplicate entry error specifically
        if (response.status === 400 && responseData.error?.includes('already exists')) {
          // Instead of throwing, we'll return a custom error object
          const error = new Error(`"${data.name}" already exists in the database.`);
          error.name = 'DuplicateEntryError';
          throw error;
        }
        const error = new Error(responseData.error || 'Failed to submit');
        error.name = 'SubmissionError';
        throw error;
      }
      
      // Update the local state with the new submission
      setSubmissions(prev => [responseData, ...prev]);
      
      // Success toast is shown by the form component
      
      return responseData;
    } catch (err) {
      // Don't log expected errors to the console
      if (!(err instanceof Error && err.name === 'DuplicateEntryError')) {
        console.error('Error in addSubmission:', err);
      }
      
      const errorMessage = err instanceof Error ? 
        (err.name === 'DuplicateEntryError' ? err.message : `Failed to submit: ${err.message}`) : 
        'An unknown error occurred';
      
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      
      // Only re-throw if it's not a duplicate entry error
      if (!(err instanceof Error && err.name === 'DuplicateEntryError')) {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/foodtree/submissions');
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = responseText ? JSON.parse(responseText) : [];
      } catch (e) {
        console.error('Failed to parse JSON response:', responseText);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        const errorMessage = responseData?.error || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      setSubmissions(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load submissions';
      setError(errorMessage);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const initialize = useCallback(() => {
    refreshSubmissions().catch(err => {
      console.error('Failed to fetch initial submissions:', err);
    });
  }, [refreshSubmissions]);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const contextValue = React.useMemo(() => ({
    submissions,
    addSubmission,
    refreshSubmissions,
    isLoading,
    error,
    success,
    setSuccess
  }), [submissions, addSubmission, refreshSubmissions, isLoading, error, success]);

  return (
    <SubmissionContext.Provider value={contextValue}>
      {children}
    </SubmissionContext.Provider>
  );
}

export interface SubmissionContextType {
  submissions: Submission[];
  addSubmission: (type: SubmissionType, data: SubmissionData) => Promise<void>;
  refreshSubmissions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: {message: string, itemName: string} | null;
}

export function useSubmissions() {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionProvider');
  }
  return context;
}
