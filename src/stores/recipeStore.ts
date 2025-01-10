import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { recipeService } from "../services/recipeService";
import type { Recipe } from "../types/recipe";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref<Recipe[]>([]);
  const categories = ref<string[]>([]);
  const currentRecipe = ref<Recipe | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const favorites = ref<Set<string>>(new Set());
  const totalRecipes = ref(0);

  const favoriteRecipes = computed(() =>
    recipes.value.filter((recipe) => favorites.value.has(String(recipe.id)))
  );

  const isFavorite = (recipeId: number): boolean => {
    return favorites.value.has(String(recipeId));
  };

  async function searchRecipes(query: string, page: number = 1) {
    loading.value = true;
    error.value = null;

    try {
      const result = await recipeService.searchRecipes(query, page);
      recipes.value = result.recipes;
      totalRecipes.value = result.total;
      return result;
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : "Wystąpił błąd podczas wyszukiwania przepisów";
      recipes.value = [];
      totalRecipes.value = 0;
      return { recipes: [], total: 0 };
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const data = await recipeService.getCategories();
      categories.value = data.map((cat: any) => cat.strCategory);
    } catch (e) {
      console.error("Error fetching categories:", e);
      categories.value = [];
    }
  }

  async function fetchRecipesByCategory(category: string, page: number = 1) {
    loading.value = true;
    error.value = null;

    try {
      const result = await recipeService.filterByCategory(category, page);
      recipes.value = result.recipes;
      totalRecipes.value = result.total;
      return result;
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : "Wystąpił błąd podczas wczytywania kategorii";
      recipes.value = [];
      totalRecipes.value = 0;
      return { recipes: [], total: 0 };
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecipeById(id: number) {
    loading.value = true;
    error.value = null;

    try {
      currentRecipe.value = await recipeService.getRecipeById(id);
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : "Wystąpił błąd podczas pobierania przepisu";
      currentRecipe.value = null;
    } finally {
      loading.value = false;
    }
  }

  function toggleFavorite(recipeId: number) {
    const stringId = String(recipeId);
    const newFavorites = new Set(favorites.value);

    if (newFavorites.has(stringId)) {
      newFavorites.delete(stringId);
    } else {
      newFavorites.add(stringId);
    }

    favorites.value = newFavorites;
    saveFavoritesToStorage();
  }

  function loadFavoritesFromStorage() {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        const favArray = JSON.parse(stored);
        favorites.value = new Set(favArray.map(String));
      } catch {
        favorites.value = new Set();
      }
    }
  }

  function saveFavoritesToStorage() {
    localStorage.setItem(
      "favorites",
      JSON.stringify(Array.from(favorites.value))
    );
  }

  loadFavoritesFromStorage();

  return {
    recipes,
    categories,
    currentRecipe,
    loading,
    error,
    favorites,
    totalRecipes,
    favoriteRecipes,
    isFavorite,
    searchRecipes,
    fetchCategories,
    fetchRecipesByCategory,
    fetchRecipeById,
    toggleFavorite,
  };
});
