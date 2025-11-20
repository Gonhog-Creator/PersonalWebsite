import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { redis } from '@/lib/kv';

// Disable caching for this endpoint
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (using the role from the token)
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      console.log('Unauthorized access attempt:', {
        email: session?.user?.email,
        hasSession: !!session,
        isAdmin: isAdmin,
        adminEmail: process.env.ADMIN_EMAIL
      });
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Get all submission keys
    const keys = await redis.keys('submission:*');
    console.log(`Found ${keys.length} submissions to process`);

    const results = {
      total: keys.length,
      updated: 0,
      unchanged: 0,
      errors: [] as string[],
    };

    // Process each submission
    for (const key of keys) {
      try {
        const submission = await redis.get(key);
        if (!submission) continue;

        const data = JSON.parse(submission);
        const oldSource = data?.data?.source;

        // Skip if no source or already using new source types
        if (!oldSource || !['grown', 'gathered', 'prepared'].includes(oldSource)) {
          results.unchanged++;
          continue;
        }

        // Map old source to new source
        const newSource = oldSource === 'prepared' ? 'other' : 'plant';
        
        // Update the submission
        await redis.set(key, JSON.stringify({
          ...data,
          data: {
            ...data.data,
            source: newSource,
            previousSource: oldSource,
          },
          updatedAt: new Date().toISOString(),
        }));

        results.updated++;
        console.log(`Updated ${key}: ${oldSource} -> ${newSource}`);
      } catch (error) {
        const errorMsg = `Error processing ${key}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: `Migration complete. Updated ${results.updated} of ${results.total} submissions.`,
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
