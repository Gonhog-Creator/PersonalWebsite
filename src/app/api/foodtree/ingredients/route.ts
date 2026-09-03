import { NextResponse } from 'next/server';
import { listIngredients, createIngredient, type IngredientSource } from '@/lib/foodtree/db';
import { containsProfanity, sanitizeText } from '@/lib/profanityFilter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const ingredients = await listIngredients(search);
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Error in GET /api/foodtree/ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (containsProfanity(body.name)) {
      return NextResponse.json({ error: 'Name contains inappropriate language' }, { status: 400 });
    }

    const source: IngredientSource = ['plant', 'animal', 'other'].includes(body.source)
      ? body.source
      : 'plant';

    const ingredient = await createIngredient({
      name: sanitizeText(body.name.trim()),
      source,
      animal_type: body.animal_type || null,
      is_source_animal: body.is_source_animal || false,
      preparation_method: body.preparation_method || null,
      parent_ingredient_ids: Array.isArray(body.parent_ingredient_ids) ? body.parent_ingredient_ids : [],
      description: body.description || null,
    });

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    const message = error instanceof Error ? error.message : 'Failed to create ingredient';
    return NextResponse.json(
      { error: message.includes('duplicate') || message.includes('unique') ? 'This ingredient already exists' : message },
      { status: message.includes('duplicate') || message.includes('unique') ? 409 : 500 }
    );
  }
}
