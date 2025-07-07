import { db } from '../db';
import { PantryItem } from '../models';

export async function getPantry(): Promise<PantryItem[]> {
  return db.getAllAsync<PantryItem>(
    `SELECT p.ingredient_id, p.quantity, i.name, i.unit
     FROM pantry p
     JOIN ingredients i ON i.id = p.ingredient_id
     ORDER BY i.name`,
  );
} 