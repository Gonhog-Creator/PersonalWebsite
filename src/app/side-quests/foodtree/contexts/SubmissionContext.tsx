'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export type SubmissionType = 'ingredient' | 'dish';

export interface SubmissionData {
  name: string;
  [key: string]: unknown;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  data: SubmissionData;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

export interface SubmissionContextType {
  submissions: Submission[];
  addSubmission: (type: SubmissionType, data: SubmissionData) => Promise<Submission>;
  refreshSubmissions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: { message: string; itemName: string } | null;
  setSuccess: (success: { message: string; itemName: string } | null) => void;
}

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; itemName: string } | null>(null);

  const refreshSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/foodtree/submissions');
      if (!response.ok) throw new Error('Failed to load submissions');
      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load submissions';
      setError(message);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSubmission = useCallback(async (type: SubmissionType, data: SubmissionData): Promise<Submission> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/foodtree/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409 || responseData.error?.includes('already exists')) {
          throw new Error(`"${data.name}" already exists in the database.`);
        }
        throw new Error(responseData.error || 'Failed to submit');
      }

      setSubmissions(prev => [responseData, ...prev]);
      return responseData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      setTimeout(() => setError(null), 5000);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubmissions().catch(() => {});
  }, [refreshSubmissions]);

  const contextValue = React.useMemo(() => ({
    submissions,
    addSubmission,
    refreshSubmissions,
    isLoading,
    error,
    success,
    setSuccess,
  }), [submissions, addSubmission, refreshSubmissions, isLoading, error, success]);

  return (
    <SubmissionContext.Provider value={contextValue}>
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionProvider');
  }
  return context;
}
