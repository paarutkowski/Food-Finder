<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecipeStore } from '../../stores/recipeStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useRecipeStore()
const selectedCategory = ref<string | null>(null)

const emit = defineEmits<{
    (e: 'select', category: string): void
}>()

onMounted(async () => {
    await store.fetchCategories()
    const categoryFromUrl = route.query.category as string
    if (categoryFromUrl) {
        selectedCategory.value = categoryFromUrl
    } else {
        selectedCategory.value = 'All'
    }
})

const handleCategorySelect = (category: string) => {
    if (category === 'All') {
        selectedCategory.value = 'All'
        store.searchRecipes('')
    } else {
        selectedCategory.value = category
        store.fetchRecipesByCategory(category)
    }
    emit('select', category)
}
</script>

<template>
    <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Kategorie</h2>
        <div class="flex flex-wrap gap-2">
            <button @click="handleCategorySelect('All')"
                class="px-4 py-2 rounded-full text-sm font-medium transition-colors" :class="[
                    selectedCategory === 'All'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]">
                All
            </button>
            <button v-for="category in store.categories" :key="category" @click="handleCategorySelect(category)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-colors" :class="[
                    selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]">
                {{ category }}
            </button>
        </div>
    </div>
</template>