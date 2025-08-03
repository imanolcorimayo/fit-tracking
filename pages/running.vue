<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <MaterialSymbolsDirectionsRun class="text-green-600" />
        Running
      </h1>
      <p class="text-gray-600">Registra tus sesiones de running</p>
      
      <!-- Error Display -->
      <div v-if="runningStore.error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ runningStore.error }}
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div class="space-y-3">
          <button 
            @click="openFormForType('easy_run')"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MaterialSymbolsDirectionsRun class="text-lg" />
            Carrera Fácil
          </button>
          <button 
            @click="openFormForType('intervals')"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MaterialSymbolsFlashOn class="text-lg" />
            Intervalos
          </button>
          <button 
            @click="openFormForType('race')"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MaterialSymbolsTrophyRounded class="text-lg" />
            Carrera/Competición
          </button>
        </div>
      </div>

      <!-- Recent Runs -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MaterialSymbolsHistoryRounded class="text-gray-600" />
          Carreras Recientes
        </h2>
        <div class="space-y-3">
          <div v-if="runningStore.loading && runningStore.sessions.length === 0" class="text-gray-500 text-center py-4">
            Cargando sesiones...
          </div>
          <div v-else-if="runningStore.sessions.length === 0" class="text-gray-500 text-center py-4">
            No hay carreras registradas aún
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="session in runningStore.getRecentSessions" 
              :key="session.id"
              class="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ new Date(session.date).toLocaleDateString('es-ES') }}</span>
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {{ getRunTypeLabel(session.type) }}
                  </span>
                </div>
                <span class="text-sm text-gray-500">{{ session.duration || '?' }} min</span>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <div v-if="session.distance" class="flex justify-between">
                  <span>Distancia:</span>
                  <span class="font-medium">{{ session.distance }} km</span>
                </div>
                <div v-if="session.average_pace" class="flex justify-between">
                  <span>Pace promedio:</span>
                  <span class="font-medium">{{ session.average_pace }} /km</span>
                </div>
                <div v-if="session.perceived_effort" class="flex justify-between">
                  <span>Esfuerzo:</span>
                  <span class="font-medium">{{ session.perceived_effort }}/10</span>
                </div>
              </div>
              <div v-if="session.notes" class="text-xs text-gray-500 mt-2 truncate">
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
          Récords de Running
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Distancia total:</span>
            <span class="font-semibold">{{ runningStore.totalDistance.toFixed(1) }} km</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Esta semana:</span>
            <span class="font-semibold">{{ runningStore.weekDistance.toFixed(1) }} km</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mejor pace:</span>
            <span class="font-semibold">{{ runningStore.bestPace || '--:--' }} /km</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Form Modal -->
    <RunningSessionForm 
      :is-open="showSessionForm"
      :initial-type="selectedRunType"
      @close="showSessionForm = false"
      @success="onSessionCreated"
    />
  </div>
</template>

<script setup>
import MaterialSymbolsDirectionsRun from "~icons/material-symbols/directions-run";
import MaterialSymbolsFlashOn from "~icons/material-symbols/flash-on";
import MaterialSymbolsTrophyRounded from "~icons/material-symbols/trophy-rounded";
import MaterialSymbolsHistoryRounded from "~icons/material-symbols/history-rounded";

const runningStore = useRunningStore()

// Form state
const showSessionForm = ref(false)
const selectedRunType = ref('easy_run')

// Fetch sessions when component mounts
onMounted(() => {
  runningStore.fetchSessions(10)
})

const openFormForType = (type) => {
  selectedRunType.value = type
  showSessionForm.value = true
}

const onSessionCreated = () => {
  runningStore.fetchSessions(10)
}

const getRunTypeLabel = (type) => {
  const labels = {
    easy_run: 'Fácil',
    intervals: 'Intervalos',
    tempo: 'Tempo',
    long_run: 'Larga',
    race: 'Carrera'
  }
  return labels[type] || type
}

useHead({
  title: "Running - Fit Tracker"
});
</script>