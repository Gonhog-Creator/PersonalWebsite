import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { addSubmission as addSubmissionToKv, getAllSubmissions, deleteSubmission } from '@/lib/kv';
import { containsProfanity, sanitizeText } from '@/lib/profanityFilter';

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

    // Check for profanity in the submission
    const checkForProfanity = (data: any): string | null => {
      // Check name
      if (containsProfanity(data.name)) {
        return 'Name contains inappropriate language';
      }
      
      // Check description if it exists
      if (data.description && containsProfanity(data.description)) {
        return 'Description contains inappropriate language';
      }
      
      // Check submittedName if it exists
      if (data.submittedName && containsProfanity(data.submittedName)) {
        return 'Submitted by name contains inappropriate language';
      }
      
      // Check parentIngredients if they exist
      if (Array.isArray(data.parentIngredients)) {
        for (const ingredient of data.parentIngredients) {
          if (containsProfanity(ingredient)) {
            return 'One or more ingredients contain inappropriate language';
          }
        }
      }
      
      return null;
    };

    // Check for profanity
    const profanityError = checkForProfanity(data);
    if (profanityError) {
      return new NextResponse(
        JSON.stringify({ error: profanityError }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Sanitize text fields
    const sanitizeData = (data: any): any => {
      const sanitized = { 
        ...data,
        // Ensure submittedBy is included in the data object
        submittedBy: data.submittedBy || data.data?.submittedBy || 'Anonymous'
      };
      
      // Sanitize string fields
      const stringFields = ['name', 'description', 'submittedName', 'animalType', 'preparationMethod', 'submittedBy'];
      stringFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = sanitizeText(sanitized[field]);
        }
      });
      
      // Sanitize array fields
      if (Array.isArray(sanitized.parentIngredients)) {
        sanitized.parentIngredients = sanitized.parentIngredients.map((ingredient: string) => 
          sanitizeText(ingredient)
        );
      }
      
      return sanitized;
    };

    // Normalize the submission name (capitalize first letter of each word)
    const normalizeName = (name: string): string => {
      if (!name) return name;
      return name.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();
    };

    // Sanitize and prepare submission data
    const sanitizedData = sanitizeData(data);
    const submissionData = {
      ...sanitizedData,
      // Normalize the name
      name: normalizeName(sanitizedData.name),
      // Add submission metadata for anonymous users
      submittedName: sanitizedData.submittedName,
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
