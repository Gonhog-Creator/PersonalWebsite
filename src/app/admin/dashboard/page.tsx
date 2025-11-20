'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Eye, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Submission, SubmissionFilters } from '@/types/submission';
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '@/lib/api/submissions';
import { SubmissionModal } from '@/components/admin/SubmissionModal';
import { MigrationTool } from '../components/MigrationTool';
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
  // Remove dark mode state and effects since we're only using light mode

  // Fetch all submissions on initial load
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all submissions without filters
      const data = await getSubmissions({});
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter submissions based on search term and other filters
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      // Search by name or ID
      const searchTerm = (filters.search || '').toLowerCase();
      const matchesSearch = !searchTerm || 
        (submission.data?.name?.toLowerCase().includes(searchTerm)) || 
        submission.id.toLowerCase().includes(searchTerm) ||
        (submission.submittedBy && submission.submittedBy.toLowerCase().includes(searchTerm));

      // Filter by type if specified
      const matchesType = !filters.type || submission.type === filters.type;

      return matchesSearch && matchesType;
    });
  }, [submissions, filters.search, filters.type]);

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
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 transition-colors duration-200 overflow-x-hidden flex justify-center">
      <div className="w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl">
              Submissions
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Manage and review all user submissions
            </p>
          </div>
        </div>

        {/* Migration Tool */}
        <div className="mb-6">
          <MigrationTool />
        </div>

        {/* Filters */}
        <div className="bg-gray-800 shadow-sm rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                {/* Search Input */}
                <div className="md:col-span-7">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                    Search
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="search"
                      placeholder="Search by name, ID, or submitter..."
                      className="pl-10 w-full bg-white text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.search || ''}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                {/* Type Selector */}
                <div className="md:col-span-2">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={filters.type || 'all'}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        type: e.target.value === 'all' ? undefined : e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <div className="md:col-span-1 flex items-end">
                  <Button
                    variant="outline"
                    className="w-full h-10 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    onClick={() => setFilters({})}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-6 border border-red-200 dark:border-red-800">
            <div className="space-y-6">
              <MigrationTool />
              <div className="flex justify-between items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-700 transition-colors duration-200 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-gray-300">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center p-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No submissions</h3>
              <p className="mt-1 text-sm text-gray-400">
                {Object.keys(filters).length > 0
                  ? 'No submissions match your filters.'
                  : 'Get started by creating a new submission.'}
              </p>
              {Object.keys(filters).length > 0 && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    onClick={() => setFilters({})}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="w-full table-fixed">
                <colgroup>
                  <col className="w-24" />
                  <col className="min-w-[200px]" />
                  <col className="w-24" />
                  <col className="min-w-[150px]" />
                  <col className="w-32" />
                  <col className="w-32" />
                </colgroup>
                <TableHeader className="bg-gray-700">
                  <TableRow className="border-b border-gray-600">
                    <TableHead className="w-24 py-3.5 px-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">ID</TableHead>
                    <TableHead className="min-w-[200px] py-3.5 px-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</TableHead>
                    <TableHead className="w-24 py-3.5 px-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</TableHead>
                    <TableHead className="min-w-[150px] py-3.5 px-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Submitted By</TableHead>
                    <TableHead className="w-32 py-3.5 px-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</TableHead>
                    <TableHead className="w-32 py-3.5 px-2 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <TableRow 
                      key={submission.id}
                      className="bg-gray-800 hover:bg-gray-700/80 transition-colors border-b border-gray-700"
                    >
                      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium text-white">
                        <span className="font-mono">
                          {submission.id.includes(':') 
                            ? submission.id.split(':')[1].substring(0, 8)
                            : submission.id.substring(0, 8) + '...'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                        {submission.data?.name || submission.submittedName || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                          {submission.type}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                        {submission.data?.submittedName || submission.submittedBy || 'Anonymous'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4 px-4 text-sm text-gray-400">
                        <time dateTime={submission.submittedAt}>
                          {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                        </time>
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-blue-400 hover:bg-gray-600"
                            onClick={() => setSelectedSubmission(submission)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-600"
                            onClick={() =>
                              window.confirm('Are you sure you want to delete this submission?') &&
                              handleDelete(submission.id)
                            }
                            title="Delete submission"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
