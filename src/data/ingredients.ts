import { db } from '../db';
import { Ingredient } from '../models';

export async function findIngredientByName(name: string): Promise<Ingredient | null> {
  return db.getFirstAsync<Ingredient>('SELECT * FROM ingredients WHERE name = ?', [name.trim()]);
}

export async function createIngredient(name: string, unit: string | null): Promise<number> {
  const { lastInsertRowId } = await db.runAsync(
    'INSERT INTO ingredients (name, unit) VALUES (?, ?)',
    [name.trim(), unit],
  );
  return lastInsertRowId;
}

export async function getOrCreateIngredient(name: string, unit: string | null): Promise<number> {
  const existing = await findIngredientByName(name);
  if (existing) return existing.id;
  return createIngredient(name, unit);
} 