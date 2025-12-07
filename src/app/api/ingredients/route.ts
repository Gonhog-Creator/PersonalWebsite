import { NextResponse } from 'next/server';
import { redis } from '@/lib/kv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    // Get all submissions
    const keys = await redis.keys('submission:*');
    if (keys.length === 0) return NextResponse.json([]);
    
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

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search ingredients',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route behavior
