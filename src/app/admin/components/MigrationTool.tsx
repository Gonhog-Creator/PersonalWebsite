'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export interface SubmissionCheckResult {
  success: boolean;
  message: string;
  total: number;
  valid: number;
  issues: number;
  details: string[];
}

interface MigrationToolProps {
  onCheckComplete: (result: SubmissionCheckResult) => void;
}

export function MigrationTool({ onCheckComplete }: MigrationToolProps) {
  const [isLoading, setIsLoading] = useState(false);

  const checkSubmissions = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/foodtree/admin/check-submissions');
      
      if (response.status === 401) {
        onCheckComplete({
          success: false,
          message: 'You are not authorized to perform this action',
          total: 0,
          valid: 0,
          issues: 1,
          details: ['Authentication required']
        });
        return;
      }
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Error checking submissions:', error);
        onCheckComplete({
          success: false,
          message: `Error checking submissions: ${error}`,
          total: 0,
          valid: 0,
          issues: 1,
          details: [error]
        });
        return;
      }
      
      const data = await response.json();
      onCheckComplete(data);
    } catch (error) {
      console.error('Error checking submissions:', error);
      onCheckComplete({
        success: false,
        message: 'Failed to check submissions. Please try again.',
        total: 0,
        valid: 0,
        issues: 1,
        details: [(error as Error).message || 'Unknown error']
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={checkSubmissions}
      disabled={isLoading}
      variant="outline"
      className="h-10 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
    >
      {isLoading ? 'Checking...' : 'Check Submissions'}
    </Button>
  );
}
