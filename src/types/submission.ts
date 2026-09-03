export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

interface BaseSubmissionData {
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface Submission {
  id: string;
  type: 'ingredient' | 'dish';
  status: SubmissionStatus;
  data: BaseSubmissionData;
  submitted_by: string;
  submitted_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  type?: string;
  search?: string;
}
