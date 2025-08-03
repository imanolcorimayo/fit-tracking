<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">🏃‍♂️ Running</h1>
      <p class="text-gray-600">Registra tus sesiones de running</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div class="space-y-3">
          <button class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            🏃‍♂️ Carrera Fácil
          </button>
          <button class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            ⚡ Intervalos
          </button>
          <button class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            🏆 Carrera/Competición
          </button>
        </div>
      </div>

      <!-- Recent Runs -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Carreras Recientes</h2>
        <div class="space-y-3">
          <div class="text-gray-500 text-center py-4">
            No hay carreras registradas aún
          </div>
        </div>
      </div>

      <!-- Personal Records -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Récords de Running</h2>
        <div class="space-y-3">
          <div class="text-gray-500 text-center py-4">
            Registra tus primeras carreras
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Running - Fit Tracker"
});
</script>