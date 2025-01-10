import axios from "axios";
import type { Recipe } from "../types/recipe";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const api = axios.create({
  baseURL: BASE_URL,
});

const ITEMS_PER_PAGE = 9;

export const recipeService = {
  async searchRecipes(
    query: string,
    page: number = 1
  ): Promise<{ recipes: Recipe[]; total: number }> {
    try {
      const response = await api.get("/search.php", {
        params: { s: query },
      });

      if (!response.data.meals) {
        return { recipes: [], total: 0 };
      }

      const allRecipes = response.data.meals.map((meal: any) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        readyInMinutes: 30,
        servings: 4,
        healthScore: 80,
        vegetarian: meal.strCategory === "Vegetarian",
        vegan: false,
      }));

      const start = (page - 1) * ITEMS_PER_PAGE;
      const paginatedRecipes = allRecipes.slice(start, start + ITEMS_PER_PAGE);

      return {
        recipes: paginatedRecipes,
        total: allRecipes.length,
      };
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  },

  async getRecipeById(id: number) {
    try {
      const response = await api.get(`/lookup.php?i=${id}`);

      if (!response.data.meals || response.data.meals.length === 0) {
        throw new Error("Recipe not found");
      }

      const meal = response.data.meals[0];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
          ingredients.push({
            id: i,
            name: ingredient,
            amount: 1,
            unit: measure || "",
            image: `https://www.themealdb.com/images/ingredients/${ingredient}.png`,
          });
        }
      }

      const instructions = meal.strInstructions
        .split(/\r\n|\r|\n/)
        .filter((step: string) => step.trim().length > 0);

      return {
        id: parseInt(meal.idMeal),
        title: meal.strMeal,
        image: meal.strMealThumb,
        readyInMinutes: 30,
        servings: 4,
        healthScore: 80,
        vegetarian: meal.strCategory === "Vegetarian",
        vegan: false,
        ingredients,
        instructions,
        category: meal.strCategory,
        area: meal.strArea,
        video: meal.strYoutube,
      };
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get("/categories.php");
      return response.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async filterByCategory(category: string, page: number = 1) {
    try {
      const response = await api.get("/filter.php", {
        params: { c: category },
      });

      if (!response.data.meals) {
        return { recipes: [], total: 0 };
      }

      const allRecipes = response.data.meals.map((meal: any) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        readyInMinutes: 30,
        servings: 4,
        healthScore: 80,
        vegetarian: category === "Vegetarian",
        vegan: false,
      }));

      const start = (page - 1) * ITEMS_PER_PAGE;
      const paginatedRecipes = allRecipes.slice(start, start + ITEMS_PER_PAGE);

      return {
        recipes: paginatedRecipes,
        total: allRecipes.length,
      };
    } catch (error) {
      console.error("Error filtering by category:", error);
      throw error;
    }
  },
};
