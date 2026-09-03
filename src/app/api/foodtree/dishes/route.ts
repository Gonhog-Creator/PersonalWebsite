import { NextResponse } from 'next/server';
import { listDishes, createDish } from '@/lib/foodtree/db';
import { containsProfanity, sanitizeText } from '@/lib/profanityFilter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const dishes = await listDishes(search);
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error in GET /api/foodtree/dishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
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

    const dish = await createDish({
      name: sanitizeText(body.name.trim()),
      cooking_method: body.cooking_method || undefined,
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      recipe_steps: Array.isArray(body.recipe_steps) ? body.recipe_steps : [],
      serving_size: body.serving_size || undefined,
      cooking_time: body.cooking_time || undefined,
      description: body.description || undefined,
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    const message = error instanceof Error ? error.message : 'Failed to create dish';
    return NextResponse.json(
      { error: message.includes('duplicate') || message.includes('unique') ? 'This dish already exists' : message },
      { status: message.includes('duplicate') || message.includes('unique') ? 409 : 500 }
    );
  }
}
