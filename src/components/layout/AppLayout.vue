<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/" class="flex items-center">
                            <span class="text-2xl font-bold text-emerald-600">🍳 FoodFinder</span>
                        </router-link>
                    </div>

                    <div class="hidden sm:flex items-center space-x-8">
                        <router-link to="/" class="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md"
                            :class="{ 'text-emerald-600': route.path === '/' }">
                            Strona główna
                        </router-link>
                        <router-link to="/recipes" class="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md"
                            :class="{ 'text-emerald-600': route.path.includes('/recipes') }">
                            Przepisy
                        </router-link>
                        <router-link to="/favorites" class="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md"
                            :class="{ 'text-emerald-600': route.path === '/favorites' }">
                            Ulubione
                        </router-link>
                    </div>

                    <div class="sm:hidden flex items-center">
                        <button @click="toggleMenu" class="text-gray-700 hover:text-emerald-600">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-show="isMenuOpen" class="sm:hidden">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <router-link to="/"
                        class="block px-3 py-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        :class="{ 'bg-emerald-50 text-emerald-600': route.path === '/' }" @click="isMenuOpen = false">
                        Strona główna
                    </router-link>
                    <router-link to="/recipes"
                        class="block px-3 py-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        :class="{ 'bg-emerald-50 text-emerald-600': route.path.includes('/recipes') }"
                        @click="isMenuOpen = false">
                        Przepisy
                    </router-link>
                    <router-link to="/favorites"
                        class="block px-3 py-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        :class="{ 'bg-emerald-50 text-emerald-600': route.path === '/favorites' }"
                        @click="isMenuOpen = false">
                        Ulubione
                    </router-link>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-8rem)]">
            <slot></slot>
        </main>

        <footer class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p class="text-center text-gray-500">
                    © {{ new Date().getFullYear() }} FoodFinder - Patryk Rutkowski - All rights reserved.
                </p>
            </div>
        </footer>
    </div>
</template>