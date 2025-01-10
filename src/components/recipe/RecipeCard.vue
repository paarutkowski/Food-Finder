<script setup lang="ts">
import { computed } from 'vue'
import { useRecipeStore } from '../../stores/recipeStore'
import { useRoute } from 'vue-router'
import type { Recipe } from '../../types/recipe'

const props = defineProps<{
    recipe: Recipe
}>()

const emit = defineEmits<{
    (e: 'favoriteRemoved'): void
}>()

const route = useRoute()
const store = useRecipeStore()
const isInFavorites = computed(() => route.path === '/favorites')
const isFavorite = computed(() => store.isFavorite(props.recipe.id))

const toggleFavorite = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()

    store.toggleFavorite(props.recipe.id)
    if (isInFavorites.value && isFavorite.value) {
        emit('favoriteRemoved')
    }
}
</script>

<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="relative">
            <img :src="recipe.image" :alt="recipe.title" class="w-full h-48 object-cover" />
            <button @click="toggleFavorite"
                class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                    :class="{ 'text-red-500 fill-current': isFavorite }" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>
        <router-link :to="`/recipes/${recipe.id}`">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ recipe.title }}</h3>
                <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clip-rule="evenodd" />
                        </svg>
                        {{ recipe.readyInMinutes }} min
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {{ recipe.servings }} porcji
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd" />
                        </svg>
                        Health Score: {{ recipe.healthScore }}
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>