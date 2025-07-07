export interface RecipeIngredient {
  recipe_id: number;
  ingredient_id: number;
  name: string;
  quantity: number;
  unit?: string | null;
} 