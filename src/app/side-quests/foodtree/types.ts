export type IngredientSource = 'grown' | 'gathered' | 'prepared';
export type PreparationMethod = 'chopped' | 'diced' | 'sliced' | 'minced' | 'grated' | 'mashed' | 'blended' | 'crushed' | 'juiced' | 'peeled';
export type CookingMethod = 'cooked' | 'steamed' | 'boiled' | 'toasted' | 'grilled' | 'smoked' | 'oil-fried' | 'air-fried' | 'raw' | 'mixed' | 'blended' | 'shredded' | 'baked';

export interface BaseItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseIngredient extends BaseItem {
  type: 'ingredient';
  source: IngredientSource;
  preparationMethod?: PreparationMethod;
  parentIngredients?: string[]; // IDs of parent ingredients if source is 'prepared'
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface Dish extends BaseItem {
  type: 'dish';
  cookingMethod: CookingMethod;
  ingredients: Array<{
    ingredientId: string;
    amount?: string;
    notes?: string;
  }>;
  tags: string[];
  recipeSteps?: string[];
  servingSize?: string;
  cookingTime?: number; // in minutes
}

export type FoodItem = BaseIngredient | Dish;

export interface FoodNode {
  id: string;
  name: string;
  type: 'ingredient' | 'dish';
  children: string[];
  parents: string[];
  x?: number;
  y?: number;
  z?: number;
}

export interface FoodGraph {
  nodes: Record<string, FoodNode>;
  rootIds: string[];
}
