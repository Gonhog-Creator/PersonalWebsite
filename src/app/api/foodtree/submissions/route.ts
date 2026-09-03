import { NextResponse } from 'next/server';
import { listSubmissions, createSubmission } from '@/lib/foodtree/db';
import { containsProfanity, sanitizeText } from '@/lib/profanityFilter';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();

    if (!type || !data || !data.name) {
      return NextResponse.json(
        { error: 'Type and data with name are required' },
        { status: 400 }
      );
    }

    if (!['ingredient', 'dish'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "ingredient" or "dish"' },
        { status: 400 }
      );
    }

    // Check for profanity in all string fields
    const fieldsToCheck = ['name', 'description', 'submittedBy', 'animalType', 'preparationMethod'];
    for (const field of fieldsToCheck) {
      if (data[field] && containsProfanity(data[field])) {
        return NextResponse.json(
          { error: `${field} contains inappropriate language` },
          { status: 400 }
        );
      }
    }

    if (Array.isArray(data.parentIngredients)) {
      for (const ingredient of data.parentIngredients) {
        if (containsProfanity(ingredient)) {
          return NextResponse.json(
            { error: 'One or more ingredients contain inappropriate language' },
            { status: 400 }
          );
        }
      }
    }

    // Sanitize text fields
    const sanitizedData = { ...data };
    fieldsToCheck.forEach(field => {
      if (sanitizedData[field]) {
        sanitizedData[field] = sanitizeText(sanitizedData[field]);
      }
    });
    if (Array.isArray(sanitizedData.parentIngredients)) {
      sanitizedData.parentIngredients = sanitizedData.parentIngredients.map((ing: string) => sanitizeText(ing));
    }

    // Normalize name
    sanitizedData.name = sanitizedData.name.toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();

    const submission = await createSubmission({
      type,
      data: sanitizedData,
      submitted_by: sanitizedData.submittedBy || 'Anonymous',
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error in submissions API:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message.includes('already exists') ? 'This item already exists' : message },
      { status: message.includes('already exists') ? 409 : 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const submissions = await listSubmissions(status || undefined);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
