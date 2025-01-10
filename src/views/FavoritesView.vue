<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { recipeService } from '../services/recipeService'
import type { Recipe } from '../types/recipe'
import RecipeList from '../components/recipe/RecipeList.vue'

const store = useRecipeStore()
const favoriteRecipes = ref<Recipe[]>([])
const loading = ref(false)

const loadFavoriteRecipes = async () => {
    if (store.favorites.size === 0) {
        favoriteRecipes.value = []
        return
    }

    loading.value = true
    try {
        const uniqueFavoriteIds = Array.from(new Set(store.favorites))
        const recipes = await Promise.all(
            uniqueFavoriteIds.map(id =>
                recipeService.getRecipeById(Number(id))
                    .catch(() => null)
            )
        )

        favoriteRecipes.value = recipes.filter((recipe): recipe is NonNullable<typeof recipe> =>
            recipe !== null
        )
    } catch (error) {
        console.error('Error loading favorites:', error)
        favoriteRecipes.value = []
    } finally {
        loading.value = false
    }
}

onMounted(loadFavoriteRecipes)

watch(
    () => store.favorites.size,
    () => {
        loadFavoriteRecipes()
    }
)
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Ulubione przepisy</h1>
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {{ favoriteRecipes.length }} przepisów
            </span>
        </div>

        <RecipeList :recipes="favoriteRecipes" :loading="loading" />

        <div v-if="!loading && favoriteRecipes.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
                Brak ulubionych przepisów
            </h3>
            <p class="text-gray-600 mb-4">
                Dodaj przepisy do ulubionych, aby mieć do nich szybki dostęp
            </p>
            <router-link to="/recipes"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Przeglądaj przepisy
            </router-link>
        </div>
    </div>
</template>