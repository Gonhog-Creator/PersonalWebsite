'use server';

import { redis } from '@/lib/kv';

interface Submission {
  id: string;
  type: string;
  data: {
    name: string;
    submittedBy?: string;
    submittedName?: string;
  };
  status: string;
  submittedAt: string;
  updatedAt: string;
  createdAt?: string;
}

export async function resetRedisDatabase(jsonData: string): Promise<{ success: boolean; message: string }> {
  try {
    const submissions: Submission[] = JSON.parse(jsonData);
    
    if (!Array.isArray(submissions)) {
      throw new Error('Invalid format: Expected an array of submissions');
    }
    
    // Get all existing submission keys
    const existingKeys = await redis.keys('submission:*');
    if (existingKeys.length > 0) {
      // Delete existing submissions in batches
      const BATCH_SIZE = 100;
      for (let i = 0; i < existingKeys.length; i += BATCH_SIZE) {
        const batch = existingKeys.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(key => redis.del(key)));
      }
    }
    
    // Import the new submissions
    for (const submission of submissions) {
      if (submission.id && submission.type && submission.data) {
        const key = `submission:${submission.id}`;
        await redis.set(key, JSON.stringify(submission));
      }
    }
    
    return { success: true, message: 'Database has been reset successfully!' };
  } catch (error) {
    console.error('Error resetting database:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to reset database' 
    };
  }
}
