export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  vegetarian: boolean;
  vegan: boolean;
  ingredients?: Ingredient[];
  instructions?: string[];
  category?: string;
  area?: string;
  video?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface SearchFilters {
  diet?: string;
  cuisine?: string;
  maxReadyTime?: number;
  vegetarian?: boolean;
  vegan?: boolean;
}
