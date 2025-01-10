<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRecipeStore } from "../stores/recipeStore";

const route = useRoute();
const router = useRouter();
const store = useRecipeStore();

const isFavorite = computed(() => {
  return store.currentRecipe ? store.isFavorite(store.currentRecipe.id) : false
})

onMounted(async () => {
  const recipeId = Number(route.params.id)
  if (!isNaN(recipeId)) {
    await store.fetchRecipeById(recipeId)
  }
})

const getYoutubeEmbedUrl = (url: string | undefined) => {
  if (!url) return undefined
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[7].length === 11) ? match[7] : false
  return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined
}

const toggleFavorite = () => {
  if (store.currentRecipe) {
    store.toggleFavorite(store.currentRecipe.id)
  }
}
</script>

<template>
  <div>
    <div v-if="store.loading" class="animate-pulse">
      <div class="h-64 bg-gray-200 rounded-lg mb-8"></div>
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="store.error" class="text-center py-12">
      <div class="text-red-500 mb-4">{{ store.error }}</div>
      <button @click="router.push('/recipes')" class="text-emerald-600 hover:text-emerald-700">
        Wróć do listy przepisów
      </button>
    </div>

    <div v-else-if="store.currentRecipe" class="max-w-4xl mx-auto">
      <div class="relative">
        <img :src="store.currentRecipe.image" :alt="store.currentRecipe.title"
          class="w-full h-64 object-cover rounded-lg shadow-lg" />
        <button @click="toggleFavorite"
          class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="{ 'text-red-500 fill-current': isFavorite }"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div class="mt-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ store.currentRecipe.title }}
        </h1>

        <div class="flex flex-wrap gap-2 mb-6">
          <span v-if="store.currentRecipe.category"
            class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
            {{ store.currentRecipe.category }}
          </span>
          <span v-if="store.currentRecipe.area" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {{ store.currentRecipe.area }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="font-semibold text-gray-700">Czas przygotowania</div>
            <div class="text-2xl">{{ store.currentRecipe.readyInMinutes }} min</div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <div class="font-semibold text-gray-700">Porcje</div>
            <div class="text-2xl">{{ store.currentRecipe.servings }}</div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <div class="font-semibold text-gray-700">Health Score</div>
            <div class="text-2xl">{{ store.currentRecipe.healthScore }}/100</div>
          </div>
        </div>

        <div v-if="store.currentRecipe.ingredients?.length" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">Składniki</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="ingredient in store.currentRecipe.ingredients" :key="ingredient.id"
              class="flex items-center space-x-3">
              <img :src="ingredient.image" :alt="ingredient.name" class="w-10 h-10 object-cover rounded" @error="(e) => {
                const target = e.target as HTMLImageElement;
                if (target) {
                  target.style.display = 'none';
                }
              }
                " />
              <span> {{ ingredient.unit }} {{ ingredient.name }} </span>
            </div>
          </div>
        </div>

        <div v-if="store.currentRecipe.instructions?.length" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">Instrukcje przygotowania</h2>
          <ol class="space-y-4">
            <li v-for="(instruction, index) in store.currentRecipe.instructions" :key="index" class="flex">
              <span class="font-bold mr-4">{{ index + 1 }}.</span>
              <span>{{ instruction }}</span>
            </li>
          </ol>
        </div>

        <div v-if="store.currentRecipe.video" class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">Wideo instruktaż</h2>
          <div class="aspect-w-16 aspect-h-9">
            <iframe :src="getYoutubeEmbedUrl(store.currentRecipe.video)" class="w-full h-[400px] rounded-lg border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <button @click="router.push('/recipes')"
          class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
          Wróć do listy przepisów
        </button>
      </div>
    </div>
  </div>
</template>
