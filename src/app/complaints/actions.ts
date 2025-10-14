'use server';

import { kv } from '@vercel/kv';

export async function incrementComplaintCounter() {
  try {
    // Increment the counter in Vercel KV
    const count = await kv.incr('complaint_counter');
    return { count, error: null };
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return { count: 0, error: 'Failed to update counter' };
  }
}

export async function getComplaintCounter() {
  try {
    // Get the current counter value
    const count = await kv.get('complaint_counter');
    return { count: Number(count) || 0, error: null };
  } catch (error) {
    console.error('Error getting counter:', error);
    return { count: 0, error: 'Failed to get counter' };
  }
}
