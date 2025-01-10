<script setup lang="ts">
import type { Recipe } from '../../types/recipe'
import RecipeCard from './RecipeCard.vue'

const props = defineProps<{
    recipes: Recipe[]
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'favoriteRemoved'): void
}>()
</script>

<template>
    <div>
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4 space-y-4">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="props.recipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCard v-for="recipe in props.recipes" :key="recipe.id" :recipe="recipe"
                @favorite-removed="emit('favoriteRemoved')" />
        </div>

        <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Brak przepisów</h3>
            <p class="mt-1 text-sm text-gray-500">
                Spróbuj zmienić kryteria wyszukiwania
            </p>
        </div>
    </div>
</template>