'use client';

import { useEffect } from 'react';
import { useSubmissions } from '../contexts/SubmissionContext';
import { formatDistanceToNow } from 'date-fns';

type SubmissionType = 'ingredient' | 'dish' | 'preparation-method';

const typeEmoji: Record<SubmissionType, string> = {
  'ingredient': '🥕',
  'dish': '🍲',
  'preparation-method': '🔪',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function SubmissionQueue() {
  const { submissions, refreshSubmissions, isLoading, error } = useSubmissions();

  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  if (isLoading && submissions.length === 0) {
    return <div className="text-center py-4">Loading submissions...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No submissions yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Your Submissions
      </h3>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {typeEmoji[submission.type as SubmissionType] || '📝'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {submission.data.name || 'New ' + submission.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[submission.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {submission.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium">Admin Note:</p>
                    <p>{submission.notes}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        <p>Submissions are reviewed before being added to the public database.</p>
      </div>
    </div>
  );
}
