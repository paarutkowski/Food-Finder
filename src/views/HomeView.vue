<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const router = useRouter()
const store = useRecipeStore()

const categoryImages = {
    'Beef': '/categories/beef.jpg',
    'Chicken': '/categories/chicken.jpg',
    'Dessert': '/categories/dessert.jpg',
    'Lamb': '/categories/lamb.jpg',
    'Miscellaneous': '/categories/misc.jpg',
    'Pasta': '/categories/pasta.jpg',
    'Pork': '/categories/pork.jpg',
    'Seafood': '/categories/seafood.jpg',
    'Side': '/categories/side.jpg',
    'Starter': '/categories/starter.jpg',
    'Vegan': '/categories/vegan.jpg',
    'Vegetarian': '/categories/vegetarian.jpg',
    'default': '/categories/default.jpg'
} as const

const getCategoryImage = (category: string) => {
    return categoryImages[category as keyof typeof categoryImages] || categoryImages.default
}

onMounted(async () => {
    await store.fetchCategories()
    if (store.categories.length > 0) {
        const randomCategories = store.categories
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)

        for (const category of randomCategories) {
            await store.fetchRecipesByCategory(category)
        }
    }
})

const handleExplore = () => {
    router.push('/recipes')
}

const handleCategoryClick = (category: string) => {
    router.push({
        path: '/recipes',
        query: { category }
    })
}
</script>

<template>
    <div>

        <div class="relative">

            <div class="absolute inset-0 overflow-hidden">
                <img src="/categories/hero-food.jpg" alt="Food background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div class="relative py-24 px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                        Odkryj świat kulinarnych inspiracji
                    </h1>
                    <p class="mt-3 max-w-md mx-auto text-lg text-gray-100 sm:text-xl md:mt-5 md:max-w-3xl">
                        Tysiące przepisów z całego świata czeka na Ciebie. Gotuj, eksperymentuj i odkrywaj nowe smaki.
                    </p>
                    <div class="mt-10">
                        <button @click="handleExplore"
                            class="px-8 py-3 text-lg font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-50 md:py-4 md:text-xl md:px-10 transition-colors duration-200">
                            Rozpocznij poszukiwania
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <div class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-8">Popularne kategorie</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="category in store.categories.slice(0, 3)" :key="category"
                        @click="handleCategoryClick(category)"
                        class="relative rounded-lg overflow-hidden cursor-pointer group h-64">
                        <img :src="getCategoryImage(category)" :alt="category"
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity">
                        </div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <h3 class="text-2xl font-bold text-white">{{ category }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-8">Polecane przepisy</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <RecipeCard v-for="recipe in store.recipes.slice(0, 6)" :key="recipe.id" :recipe="recipe" />
                </div>
                <div class="text-center mt-12">
                    <button @click="handleExplore"
                        class="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200">
                        Zobacz więcej przepisów
                    </button>
                </div>
            </div>
        </div>


        <div class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div
                            class="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Szybkie wyszukiwanie</h3>
                        <p class="text-gray-600">Znajdź idealne przepisy w kilka sekund</p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Zapisz ulubione</h3>
                        <p class="text-gray-600">Zachowaj najlepsze przepisy na później</p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Wideo instrukcje</h3>
                        <p class="text-gray-600">Zobacz jak przygotować danie krok po kroku</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>