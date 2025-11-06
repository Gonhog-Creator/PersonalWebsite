'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search, Eye, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Submission, SubmissionFilters } from '@/types/submission';
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '@/lib/api/submissions';
import { SubmissionModal } from '@/components/admin/SubmissionModal';
import React from 'react';

// Reusable Button component
const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  };
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-100',
    link: 'underline-offset-4 hover:underline text-blue-600',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Reusable Badge component
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
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    outline: 'border border-gray-200 bg-transparent',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Select components are not used, keeping them commented for future reference
/*
const Select = ({
  value,
  onValueChange,
  children,
  className = '',
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {children}
    </select>
  );
};
*/

/*
const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>{children}</div>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-gray-500">{placeholder}</span>
);
*/

// Reusable Table components
const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-4 align-middle ${className}`}>{children}</td>
);

// Reusable Input component
const Input = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'ingredient', label: 'Ingredient' },
  { value: 'dish', label: 'Dish' },
  { value: 'other', label: 'Other' },
];

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filters, setFilters] = useState<SubmissionFilters>({});
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubmissions(filters);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch submissions when filters change
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/dashboard');
      return;
    }

    if (status === 'authenticated') {
      fetchSubmissions();
    }
  }, [status, filters, router, fetchSubmissions]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const updatedSubmission = await updateSubmissionStatus(id, status);
      setSubmissions(submissions.map(s => s.id === id ? updatedSubmission : s));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(updatedSubmission);
      }
    } catch (err) {
      console.error('Failed to update submission:', err);
      alert('Failed to update submission status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubmission(id);
      setSubmissions(submissions.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Failed to delete submission:', err);
      alert('Failed to delete submission');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submissions</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white" />
              <Input
                placeholder="Search submissions..."
                className="pl-10 w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <select
                  value={filters.status || 'all'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value === 'all' ? undefined : (e.target.value as Submission['status']),
                    })
                  }
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={filters.type || 'all'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value === 'all' ? undefined : e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-200">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2">Loading submissions...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-gray-500">No submissions found.</p>
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => setFilters({})}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {submission.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {submission.submittedBy}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === 'approved'
                            ? 'success'
                            : submission.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          confirm('Are you sure you want to delete this submission?') &&
                          handleDelete(submission.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <SubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onStatusChange={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
