import { Submission, SubmissionFilters } from '@/types/submission';

const API_BASE_URL = '/api/foodtree/submissions';

export const getSubmissions = async (filters?: SubmissionFilters): Promise<Submission[]> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }
  return response.json();
};

export const getSubmission = async (id: string): Promise<Submission> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch submission');
  }
  return response.json();
};

export const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected', notes?: string): Promise<Submission> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, notes }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update submission');
  }
  return response.json();
};

export const deleteSubmission = async (id: string): Promise<void> => {
  // Remove 'submission:' prefix if it exists to avoid duplication
  const submissionId = id.startsWith('submission:') ? id.split(':')[1] : id;
  
  const response = await fetch(`${API_BASE_URL}/${submissionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete submission');
  }
};
