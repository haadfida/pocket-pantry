export interface GroceryItem {
  id: number;
  ingredient_id: number;
  name: string;
  quantity: number;
  unit?: string | null;
  checked: 0 | 1;
} 