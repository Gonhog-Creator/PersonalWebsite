import { sql } from '@vercel/postgres';

export type IngredientSource = 'plant' | 'animal' | 'other';

export interface Ingredient {
  id: string;
  name: string;
  source: IngredientSource;
  animal_type: string | null;
  is_source_animal: boolean;
  preparation_method: string | null;
  parent_ingredient_ids: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dish {
  id: string;
  name: string;
  cooking_method: string | null;
  ingredients: Array<{ ingredientId: string; amount?: string; notes?: string }>;
  tags: string[];
  recipe_steps: string[];
  serving_size: string | null;
  cooking_time: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  type: 'ingredient' | 'dish';
  data: Record<string, unknown>;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

// ---- Ingredients ----

export async function listIngredients(searchTerm?: string): Promise<Ingredient[]> {
  if (searchTerm && searchTerm.trim()) {
    const result = await sql`
      SELECT * FROM foodtree_ingredients
      WHERE LOWER(name) LIKE LOWER(${'%' + searchTerm.trim() + '%'})
      ORDER BY name ASC
    `;
    return result.rows as Ingredient[];
  }
  const result = await sql`
    SELECT * FROM foodtree_ingredients
    ORDER BY name ASC
  `;
  return result.rows as Ingredient[];
}

export async function createIngredient(data: {
  name: string;
  source: IngredientSource;
  animal_type?: string;
  is_source_animal?: boolean;
  preparation_method?: string;
  parent_ingredient_ids?: string[];
  description?: string;
}): Promise<Ingredient> {
  const result = await sql`
    INSERT INTO foodtree_ingredients (name, source, animal_type, is_source_animal, preparation_method, parent_ingredient_ids, description)
    VALUES (${data.name.trim()}, ${data.source}, ${data.animal_type || null}, ${data.is_source_animal || false}, ${data.preparation_method || null}, ${JSON.stringify(data.parent_ingredient_ids || [])}::uuid[], ${data.description || null})
    RETURNING *
  `;
  return result.rows[0] as Ingredient;
}

// ---- Dishes ----

export async function listDishes(searchTerm?: string): Promise<Dish[]> {
  if (searchTerm && searchTerm.trim()) {
    const result = await sql`
      SELECT * FROM foodtree_dishes
      WHERE LOWER(name) LIKE LOWER(${'%' + searchTerm.trim() + '%'})
      ORDER BY name ASC
    `;
    return result.rows as Dish[];
  }
  const result = await sql`
    SELECT * FROM foodtree_dishes
    ORDER BY name ASC
  `;
  return result.rows as Dish[];
}

export async function createDish(data: {
  name: string;
  cooking_method?: string;
  ingredients: Array<{ ingredientId: string; amount?: string; notes?: string }>;
  tags?: string[];
  recipe_steps?: string[];
  serving_size?: string;
  cooking_time?: number;
  description?: string;
}): Promise<Dish> {
  const result = await sql`
    INSERT INTO foodtree_dishes (name, cooking_method, ingredients, tags, recipe_steps, serving_size, cooking_time, description)
    VALUES (${data.name.trim()}, ${data.cooking_method || null}, ${JSON.stringify(data.ingredients)}::jsonb, ${JSON.stringify(data.tags || [])}::text[], ${JSON.stringify(data.recipe_steps || [])}::text[], ${data.serving_size || null}, ${data.cooking_time || null}, ${data.description || null})
    RETURNING *
  `;
  return result.rows[0] as Dish;
}

// ---- Submissions ----

export async function listSubmissions(status?: string): Promise<Submission[]> {
  if (status) {
    const result = await sql`
      SELECT * FROM foodtree_submissions
      WHERE status = ${status}
      ORDER BY submitted_at DESC
    `;
    return result.rows as Submission[];
  }
  const result = await sql`
    SELECT * FROM foodtree_submissions
    ORDER BY submitted_at DESC
  `;
  return result.rows as Submission[];
}

export async function createSubmission(data: {
  type: 'ingredient' | 'dish';
  data: Record<string, unknown>;
  submitted_by?: string;
}): Promise<Submission> {
  const result = await sql`
    INSERT INTO foodtree_submissions (type, data, submitted_by)
    VALUES (${data.type}, ${JSON.stringify(data.data)}::jsonb, ${data.submitted_by || 'Anonymous'})
    RETURNING *
  `;
  return result.rows[0] as Submission;
}

export async function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<Submission> {
  const result = await sql`
    UPDATE foodtree_submissions
    SET status = ${status}, reviewed_at = NOW(), notes = ${notes || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] as Submission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  await sql`DELETE FROM foodtree_submissions WHERE id = ${id}`;
  return true;
}

// ---- Approval flow ----

export async function approveSubmission(id: string): Promise<Submission> {
  const submission = await updateSubmissionStatus(id, 'approved');

  if (submission.type === 'ingredient') {
    const data = submission.data as Record<string, unknown>;
    await createIngredient({
      name: data.name as string,
      source: (data.source as IngredientSource) || 'plant',
      animal_type: data.animal_type as string | undefined,
      is_source_animal: data.is_source_animal === 'true' || data.is_source_animal === true,
      preparation_method: data.preparation_method as string | undefined,
      parent_ingredient_ids: Array.isArray(data.parent_ingredient_ids) ? data.parent_ingredient_ids as string[] : [],
      description: data.description as string | undefined,
    });
  } else if (submission.type === 'dish') {
    const data = submission.data as Record<string, unknown>;
    await createDish({
      name: data.name as string,
      cooking_method: data.cooking_method as string | undefined,
      ingredients: data.ingredients as Array<{ ingredientId: string; amount?: string; notes?: string }>,
      tags: Array.isArray(data.tags) ? data.tags as string[] : [],
      recipe_steps: Array.isArray(data.recipe_steps) ? data.recipe_steps as string[] : [],
      serving_size: data.serving_size as string | undefined,
      cooking_time: data.cooking_time as number | undefined,
      description: data.description as string | undefined,
    });
  }

  return submission;
}
