export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

interface BaseSubmissionData {
  name: string;
  description?: string;
  [key: string]: unknown;
}

interface IngredientData extends BaseSubmissionData {
  type: 'ingredient';
  // Add more specific fields for ingredient submissions here
}

interface DishData extends BaseSubmissionData {
  type: 'dish';
  // Add more specific fields for dish submissions here
}

type OtherData = Record<string, unknown>;

export interface Submission {
  id: string;
  type: 'ingredient' | 'dish' | 'other';
  status: SubmissionStatus;
  data: IngredientData | DishData | OtherData;
  submittedBy: string;
  submittedAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
