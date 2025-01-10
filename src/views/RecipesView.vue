<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '../components/recipe/SearchBar.vue'
import RecipeList from '../components/recipe/RecipeList.vue'
import CategoriesList from '../components/recipe/CategoriesList.vue'
import { useRecipeStore } from '../stores/recipeStore'

const route = useRoute()
const store = useRecipeStore()
const searchQuery = ref('')
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = 9
const debouncedSearchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const pageNumbers = computed(() => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return pages
})

const handleSearch = async (query: string) => {
    if (debouncedSearchTimeout.value) {
        clearTimeout(debouncedSearchTimeout.value)
    }

    debouncedSearchTimeout.value = setTimeout(async () => {
        searchQuery.value = query
        currentPage.value = 1

        if (query.trim()) {
            const result = await store.searchRecipes(query, currentPage.value)
            totalItems.value = result.total
        }
    }, 300)
}

const loadAllRecipes = async () => {
    const result = await store.searchRecipes('', currentPage.value)
    totalItems.value = result.total
}

const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
    if (searchQuery.value) {
        await store.searchRecipes(searchQuery.value, page)
    } else {
        await loadAllRecipes()
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
    const query = route.query.search as string
    const category = route.query.category as string

    if (category) {
        const result = await store.fetchRecipesByCategory(category, currentPage.value)
        totalItems.value = result.total
    } else if (query) {
        searchQuery.value = query
        const result = await store.searchRecipes(query, currentPage.value)
        totalItems.value = result.total
    } else {
        await loadAllRecipes()
    }
})

const handleCategorySelect = async (category: string) => {
    currentPage.value = 1
    const result = await store.fetchRecipesByCategory(category, currentPage.value)
    totalItems.value = result.total
    searchQuery.value = ''
}
</script>

<template>
    <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Przepisy</h1>

        <div class="mb-8">
            <SearchBar @search="handleSearch" />
        </div>

        <CategoriesList v-if="!searchQuery" @select="handleCategorySelect" />

        <div v-if="store.error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
            {{ store.error }}
        </div>

        <RecipeList :recipes="store.recipes" :loading="store.loading" />

        <div v-if="totalPages > 1" class="mt-8 flex justify-center space-x-2">
            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-md text-sm font-medium" :class="currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'">
                Poprzednia
            </button>

            <button v-if="!pageNumbers.includes(1)" @click="handlePageChange(1)"
                class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
            </button>

            <span v-if="!pageNumbers.includes(1)" class="px-4 py-2">...</span>

            <button v-for="page in pageNumbers" :key="page" @click="handlePageChange(page)"
                class="px-4 py-2 rounded-md text-sm font-medium" :class="page === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'">
                {{ page }}
            </button>

            <span v-if="!pageNumbers.includes(totalPages)" class="px-4 py-2">...</span>

            <button v-if="!pageNumbers.includes(totalPages)" @click="handlePageChange(totalPages)"
                class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                {{ totalPages }}
            </button>

            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-md text-sm font-medium" :class="currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'">
                Następna
            </button>
        </div>
    </div>
</template>