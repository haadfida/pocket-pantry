import { db } from '../db';
import { Recipe } from '../models';
import { RecipeIngredient } from '../models';
import { getOrCreateIngredient } from './ingredients';

export async function getAllRecipes(): Promise<Recipe[]> {
  return db.getAllAsync<Recipe>('SELECT * FROM recipes');
}

export async function addRecipe(data: Omit<Recipe, 'id'>): Promise<void> {
  const { title, image_uri, portions, notes } = data;
  await db.runAsync(
    'INSERT INTO recipes (title, image_uri, portions, notes) VALUES (?, ?, ?, ?)',
    [title, image_uri ?? null, portions ?? 1, notes ?? null]
  );
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  return db.getFirstAsync<Recipe>('SELECT * FROM recipes WHERE id = ?', [id]);
}

export async function getIngredientsForRecipe(id: number): Promise<RecipeIngredient[]> {
  return db.getAllAsync<RecipeIngredient>(
    `SELECT ri.recipe_id, ri.ingredient_id, ri.quantity, i.name, i.unit
     FROM recipe_ingredients ri
     JOIN ingredients i ON i.id = ri.ingredient_id
     WHERE ri.recipe_id = ?`,
    [id],
  );
}

export async function addIngredientToRecipe(
  recipeId: number,
  name: string,
  quantity: number,
  unit: string | null,
): Promise<void> {
  const ingredientId = await getOrCreateIngredient(name, unit);
  await db.runAsync(
    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
     VALUES (?, ?, ?)
     ON CONFLICT(recipe_id, ingredient_id) DO UPDATE SET quantity = excluded.quantity;`,
    [recipeId, ingredientId, quantity],
  );
}

export async function getCookableRecipes(): Promise<Recipe[]> {
  return db.getAllAsync<Recipe>('SELECT * FROM v_recipes_cookable');
}

export async function canCook(recipeId: number): Promise<boolean> {
  const row = await db.getFirstAsync<{ id: number }>('SELECT id FROM v_recipes_cookable WHERE id = ?', [recipeId]);
  return !!row;
}

export async function cookRecipe(recipeId: number): Promise<void> {
  const sql = `
    BEGIN TRANSACTION;
    UPDATE pantry
    SET quantity = quantity - (
      SELECT quantity FROM recipe_ingredients ri WHERE ri.recipe_id = ${recipeId} AND ri.ingredient_id = pantry.ingredient_id
    )
    WHERE ingredient_id IN (SELECT ingredient_id FROM recipe_ingredients WHERE recipe_id = ${recipeId});

    DELETE FROM pantry WHERE quantity <= 0;

    -- Remove checked grocery items that correspond to this recipe's ingredients
    DELETE FROM grocery_list
    WHERE checked = 1 AND ingredient_id IN (
      SELECT ingredient_id FROM recipe_ingredients WHERE recipe_id = ${recipeId}
    );
    COMMIT;
  `;
  db.execSync(sql);
}

export async function deleteRecipe(id: number): Promise<void> {
  await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
} 