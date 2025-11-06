import { NextResponse } from 'next/server';
import { withRedis, createIngredient, listIngredients } from '@/lib/kv';
import { v4 as uuidv4 } from 'uuid';

interface BaseIngredient {
  id: string;
  name: string;
  description?: string;
  category?: string;
  foodType?: 'grown' | 'gathered' | 'prepared';
  parentIngredients?: string[];
  type?: 'ingredient' | 'dish' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface Ingredient {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search')?.toLowerCase() || '';
    
    // Test Redis connection first
    try {
      await withRedis(async (client) => {
        await client.ping();
      });
    } catch (redisError) {
      console.error('Redis connection test failed:', redisError);
      throw redisError;
    }
    
    const ingredients = await withRedis(async (client) => {
      // Try different key patterns to find ingredients
      let keys = await client.keys('ingredient:*');
      
      if (keys.length === 0) {
        keys = await client.keys('foodtree:ingredient:*');
      }
      
      if (keys.length === 0) {
        keys = await client.keys('submission:*');
      }
      
      if (keys.length === 0) {
        return [];
      }
      
      // Get all values in a single pipeline
      const values = await Promise.all(
        keys.map(async key => {
          try {
            const data = await client.get(key);
            if (!data) return null;
            
            try {
              return JSON.parse(data);
            } catch (e) {
              console.error(`Error parsing JSON for key ${key}:`, e);
              return null;
            }
          } catch (e) {
            console.error(`Error getting key ${key}:`, e);
            return null;
          }
        })
      );
      
      // Process submissions into ingredients
      const validIngredients = values
        .filter((item): item is { 
          id: string;
          data: { 
            name: string; 
            source?: string;
            foodType?: string;
            parentIngredients?: string[];
          };
          type?: string;
          status?: string;
        } => 
          item && 
          typeof item === 'object' && 
          item.data && 
          typeof item.data.name === 'string'
        )
        .map(item => ({
          id: item.id,
          name: item.data.name.trim(),
          type: item.type || 'ingredient',
          status: item.status,
          foodType: item.data.foodType || item.data.source || 'grown',
          parentIngredients: Array.isArray(item.data.parentIngredients) 
            ? item.data.parentIngredients 
           : [],
          ...item.data
        }));
      
      // Filter ingredients by search term if provided
      const filteredIngredients = searchTerm
        ? validIngredients.filter(ingredient => 
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : validIngredients;
      
      // Return unique ingredients by ID
      const uniqueIngredients = Array.from(
        new Map(filteredIngredients.map(item => [item.id, item])).values()
      );
      
      return uniqueIngredients;
    });
    
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Error in ingredients API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newIngredient = await request.json();
    
    // Create the ingredient using the Redis client
    const ingredient = await createIngredient({
      name: newIngredient.name,
      description: newIngredient.description,
      type: newIngredient.type || 'ingredient',
      foodType: newIngredient.foodType || 'prepared',
      parentIngredients: newIngredient.parentIngredients || [],
      category: newIngredient.category
    });
    
    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to create ingredient', details: error.message },
      { status: 500 }
    );
  }
}
