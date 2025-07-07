export interface Recipe {
  id: number;
  title: string;
  image_uri?: string | null;
  portions: number;
  notes?: string | null;
} 