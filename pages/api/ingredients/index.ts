import { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '@/lib/kv';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search } = req.query;

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Get all submissions
    const keys = await redis.keys('submission:*');
    if (keys.length === 0) return res.status(200).json([]);
    
    // Get all values in a single pipeline
    const values = await Promise.all(keys.map(key => redis.get(key)));
    
    // Parse and filter submissions
    const submissions = values
      .filter(Boolean)
      .map(value => {
        try {
          return typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
          console.error('Error parsing submission:', e);
          return null;
        }
      })
      .filter(submission => 
        submission && 
        submission.type === 'ingredient' && 
        submission.data?.name?.toLowerCase().includes(search.toLowerCase())
      );

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    return res.status(500).json({ 
      error: 'Failed to search ingredients',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
