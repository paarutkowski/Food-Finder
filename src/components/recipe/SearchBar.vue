<script setup lang="ts">
import { ref } from 'vue'
import type { SearchFilters } from '../../types/recipe'

const searchQuery = ref('')
const debouncedSearchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const emit = defineEmits<{
    (e: 'search', query: string, filters: SearchFilters): void
}>()

const handleSearch = () => {
    if (debouncedSearchTimeout.value) {
        clearTimeout(debouncedSearchTimeout.value)
    }

    debouncedSearchTimeout.value = setTimeout(() => {
        emit('search', searchQuery.value, {})
    }, 300)
}

const onInput = () => {
    handleSearch()
}
</script>

<template>
    <div>
        <div class="flex gap-2">
            <input v-model="searchQuery" type="text" placeholder="Wyszukaj przepis..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                @input="onInput" />
        </div>
    </div>
</template>