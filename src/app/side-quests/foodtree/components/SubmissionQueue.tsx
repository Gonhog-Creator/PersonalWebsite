'use client';

import { useEffect } from 'react';
import { useSubmissions } from '../contexts/SubmissionContext';
import { formatDistanceToNow } from 'date-fns';

type SubmissionType = 'ingredient' | 'dish';

const typeEmoji: Record<SubmissionType, string> = {
  'ingredient': '🥕',
  'dish': '🍲',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/50 text-yellow-300',
  approved: 'bg-green-900/50 text-green-300',
  rejected: 'bg-red-900/50 text-red-300',
};

export function SubmissionQueue() {
  const { submissions, refreshSubmissions, isLoading, error } = useSubmissions();

  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  if (isLoading && submissions.length === 0) {
    return <div className="text-center py-4 text-gray-400">Loading submissions...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No submissions yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Your Submissions</h3>

      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {typeEmoji[submission.type as SubmissionType] || '📝'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-indigo-300 truncate">
                        {(submission.data as { name?: string })?.name || `New ${submission.type}`}
                      </p>
                      <p className="text-sm text-gray-400">
                        Submitted by {submission.submitted_by || 'Anonymous'}
                        <span className="mx-2">•</span>
                        {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[submission.status] || 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                </div>

                {submission.notes && (
                  <div className="mt-2 text-sm text-gray-400">
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
