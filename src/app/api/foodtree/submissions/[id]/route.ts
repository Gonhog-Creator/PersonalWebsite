import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { deleteSubmission } from '@/lib/kv';

// CORS headers for preflight requests
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return OPTIONS();
  }

  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users to delete submissions
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const { id } = params;
    
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Submission ID is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const success = await deleteSubmission(id);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Submission not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete submission' }),
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
