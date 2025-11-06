'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { Submission } from '@/types/submission';

// Custom Dialog Component
const Dialog = ({ 
  open, 
  onClose, 
  children 
}: { 
  open: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={onClose}
        aria-hidden="true" 
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pb-0">
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h2>
);

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </div>
);

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'link';
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white',
    destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    link: 'underline-offset-4 hover:underline text-blue-600 dark:text-blue-400',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge Component
const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'outline';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    outline: 'border border-gray-200 bg-transparent dark:border-gray-600',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface SubmissionModalProps {
  submission: Submission | null;
  onClose: () => void;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function SubmissionModal({ submission, onClose, onStatusChange, onDelete }: SubmissionModalProps) {
  if (!submission) return null;

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    await onStatusChange(submission.id, status);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      await onDelete(submission.id);
      onClose();
    }
  };

  return (
    <Dialog open={!!submission} onClose={onClose}>
      <div className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>
              {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)} Submission
            </DialogTitle>
            <Badge variant={submission.status === 'approved' ? 'success' : submission.status === 'rejected' ? 'destructive' : 'secondary'}>
              {submission.status}
            </Badge>
          </div>
        </DialogHeader>

        <DialogContent>
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Submitted By</h3>
                <p className="mt-1 text-gray-900">{submission.submittedBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
                <p className="mt-1 text-gray-900">{format(new Date(submission.submittedAt), 'PPpp')}</p>
              </div>
              {submission.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-gray-900">{format(new Date(submission.updatedAt), 'PPpp')}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Submission Data</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm overflow-auto max-h-60">
                  {JSON.stringify(submission.data, null, 2)}
                </pre>
              </div>
            </div>

            {submission.notes && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-sm text-gray-700">{submission.notes}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between pt-4 border-t gap-2">
              <div className="space-x-2">
                <Button
                  variant="default"
                  onClick={() => handleStatusChange('approved')}
                  disabled={submission.status === 'approved'}
                  className={submission.status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={submission.status === 'rejected'}
                  className={submission.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Reject
                </Button>
              </div>
              <div>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Submission
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
