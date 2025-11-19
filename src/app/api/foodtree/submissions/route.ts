import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { addSubmission as addSubmissionToKv, getAllSubmissions, deleteSubmission } from '@/lib/kv';

// CORS headers for preflight requests
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return OPTIONS();
  }

  try {
    const { type, data } = await request.json();
    
    // No authentication required for submissions

    if (!type || !data || !data.name) {
      return new NextResponse(
        JSON.stringify({ error: 'Type and data with name are required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Normalize the submission name (capitalize first letter of each word)
    const normalizeName = (name: string): string => {
      if (!name) return name;
      return name.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();
    };

    // Prepare submission data with proper formatting
    const submissionData = {
      ...data,
      // Normalize the name
      name: normalizeName(data.name),
      // Add submission metadata for anonymous users
      submittedName: data.submittedName,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'pending' // Ensure status is set for new submissions
    };

    // Clean up any undefined values
    Object.keys(submissionData).forEach(key => 
      submissionData[key] === undefined && delete submissionData[key]
    );

    const submission = await addSubmissionToKv(type, submissionData);
    
    return new NextResponse(JSON.stringify(submission), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      }
    });
  } catch (error) {
    console.error('Error in submissions API:', error);
    
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({ 
          error: error.message,
          details: error.message.includes('already exists') ? 'DUPLICATE' : undefined
        }),
        { 
          status: error.message.includes('already exists') ? 409 : 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

export async function GET(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return OPTIONS();
  }

  try {
    // No authentication required to view submissions

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const submissions = await getAllSubmissions(type || undefined);
    
    return new NextResponse(JSON.stringify(submissions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    
    // In production, return empty array instead of error for static export
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch submissions' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
