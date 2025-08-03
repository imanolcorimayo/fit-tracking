<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <MaterialSymbolsFitnessCenter class="text-blue-600" />
        Gimnasio
      </h1>
      <p class="text-gray-600">Registra tus entrenamientos de gimnasio</p>
      
      <!-- Error Display -->
      <div v-if="gymStore.error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ gymStore.error }}
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div class="space-y-3">
          <button 
            @click="showNewSessionForm = true"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <IcRoundPlus class="text-lg" />
            Nueva Sesión
          </button>
          <button class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <MaterialSymbolsPlaylistAddRounded class="text-lg" />
            Plantilla Rápida
          </button>
          <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <MaterialSymbolsBarChartRounded class="text-lg" />
            Ver Progreso
          </button>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MaterialSymbolsHistoryRounded class="text-gray-600" />
          Sesiones Recientes
        </h2>
        <div class="space-y-3">
          <div v-if="gymStore.loading && gymStore.sessions.length === 0" class="text-gray-500 text-center py-4">
            Cargando sesiones...
          </div>
          <div v-else-if="gymStore.sessions.length === 0" class="text-gray-500 text-center py-4">
            No hay sesiones registradas aún
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="session in gymStore.getRecentSessions" 
              :key="session.id"
              class="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="font-medium">{{ new Date(session.date).toLocaleDateString('es-ES') }}</span>
                <span class="text-sm text-gray-500">{{ session.duration || '?' }} min</span>
              </div>
              <div class="text-sm text-gray-600">
                {{ session.exercises.length }} ejercicio{{ session.exercises.length !== 1 ? 's' : '' }}
              </div>
              <div v-if="session.notes" class="text-xs text-gray-500 mt-1 truncate">
                {{ session.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Records -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MaterialSymbolsTrophyRounded class="text-yellow-600" />
          Récords Personales
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sesiones totales:</span>
            <span class="font-semibold">{{ gymStore.totalSessions }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Esta semana:</span>
            <span class="font-semibold">{{ gymStore.weekSessions.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Récords personales:</span>
            <span class="font-semibold">-</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Form Modal -->
    <GymSessionForm 
      :is-open="showNewSessionForm"
      @close="showNewSessionForm = false"
      @success="onSessionCreated"
    />
  </div>
</template>

<script setup>
import MaterialSymbolsFitnessCenter from "~icons/material-symbols/fitness-center";
import IcRoundPlus from "~icons/ic/round-plus";
import MaterialSymbolsPlaylistAddRounded from "~icons/material-symbols/playlist-add-rounded";
import MaterialSymbolsBarChartRounded from "~icons/material-symbols/bar-chart-rounded";
import MaterialSymbolsHistoryRounded from "~icons/material-symbols/history-rounded";
import MaterialSymbolsTrophyRounded from "~icons/material-symbols/trophy-rounded";

const gymStore = useGymStore()

// Fetch sessions when component mounts
onMounted(() => {
  gymStore.fetchSessions(10) // Get last 10 sessions
})

const showNewSessionForm = ref(false)

const onSessionCreated = () => {
  // Refresh sessions after creating a new one
  gymStore.fetchSessions(10)
}

useHead({
  title: "Gimnasio - Fit Tracker"
});
</script>