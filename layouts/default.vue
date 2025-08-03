<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <NuxtLink to="/gym" class="flex items-center space-x-2">
              <MaterialSymbolsFitnessCenter class="text-2xl text-blue-600" />
              <span class="text-xl font-semibold text-gray-900">Fit Tracker</span>
            </NuxtLink>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/gym" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
              <MaterialSymbolsFitnessCenter class="text-base" />
              Gimnasio
            </NuxtLink>
            <NuxtLink to="/running" class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
              <MaterialSymbolsDirectionsRun class="text-base" />
              Running
            </NuxtLink>
            <NuxtLink to="/stats" class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
              <MaterialSymbolsBarChartRounded class="text-base" />
              Estadísticas
            </NuxtLink>
            <NuxtLink to="/exercises" class="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
              <MaterialSymbolsExercise class="text-base" />
              Ejercicios
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div v-if="user" class="flex items-center space-x-3">
              <img 
                v-if="user.photoURL" 
                :src="user.photoURL" 
                :alt="user.displayName || 'Usuario'"
                class="w-8 h-8 rounded-full"
              >
              <span class="text-sm text-gray-700">{{ user.displayName || 'Usuario' }}</span>
              <button 
                @click="signOut"
                class="text-sm text-gray-500 hover:text-red-600 transition-colors"
                :disabled="signingOut"
              >
                {{ signingOut ? 'Saliendo...' : 'Salir' }}
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NuxtLink to="/gym" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2">
              <MaterialSymbolsFitnessCenter class="text-lg" />
              Gimnasio
            </NuxtLink>
            <NuxtLink to="/running" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 flex items-center gap-2">
              <MaterialSymbolsDirectionsRun class="text-lg" />
              Running
            </NuxtLink>
            <NuxtLink to="/stats" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 flex items-center gap-2">
              <MaterialSymbolsBarChartRounded class="text-lg" />
              Estadísticas
            </NuxtLink>
            <NuxtLink to="/exercises" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 flex items-center gap-2">
              <MaterialSymbolsExercise class="text-lg" />
              Ejercicios
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { signOut as firebaseSignOut } from "firebase/auth";
import MaterialSymbolsFitnessCenter from "~icons/material-symbols/fitness-center";
import MaterialSymbolsDirectionsRun from "~icons/material-symbols/directions-run";
import MaterialSymbolsBarChartRounded from "~icons/material-symbols/bar-chart-rounded";
import MaterialSymbolsExercise from "~icons/material-symbols/exercise";

const user = useCurrentUser();
const auth = useFirebaseAuth();
const mobileMenuOpen = ref(false);
const signingOut = ref(false);

async function signOut() {
  if (!auth) return;
  
  try {
    signingOut.value = true;
    await firebaseSignOut(auth);
    await navigateTo('/welcome');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    signingOut.value = false;
  }
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false;
});
</script>