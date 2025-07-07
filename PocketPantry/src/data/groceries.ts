import { db } from '../db';
import { GroceryItem } from '../models';
import { getOrCreateIngredient } from './ingredients';

export async function getGroceryList(): Promise<GroceryItem[]> {
  return db.getAllAsync<GroceryItem>(
    `SELECT g.*, i.name, i.unit
     FROM grocery_list g
     JOIN ingredients i ON i.id = g.ingredient_id
     ORDER BY g.checked, i.name`,
  );
}

export async function addGroceryItem(name: string, quantity: number, unit: string | null): Promise<void> {
  const ingredientId = await getOrCreateIngredient(name, unit);
  await db.runAsync(
    'INSERT INTO grocery_list (ingredient_id, quantity, checked) VALUES (?, ?, 0)',
    [ingredientId, quantity],
  );
}

export async function toggleGroceryChecked(id: number, checked: boolean): Promise<void> {
  await db.runAsync('UPDATE grocery_list SET checked = ? WHERE id = ?', [checked ? 1 : 0, id]);
}

export async function deleteGroceryItem(id: number): Promise<void> {
  await db.runAsync('DELETE FROM grocery_list WHERE id = ?', [id]);
}

export async function updateGroceryItem(id: number, quantity: number, unit: string | null): Promise<void> {
  await db.runAsync('UPDATE grocery_list SET quantity = ?, checked = 0 WHERE id = ?', [quantity, id]);
  await db.runAsync('UPDATE ingredients SET unit = ? WHERE id = (SELECT ingredient_id FROM grocery_list WHERE id = ?)', [unit, id]);
} 