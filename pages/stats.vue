<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <MaterialSymbolsBarChartRounded class="text-purple-600" />
        Estadísticas
      </h1>
      <p class="text-gray-600">Visualiza tu progreso y récords personales</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Gym Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <MaterialSymbolsFitnessCenter class="text-2xl mr-2 text-blue-600" />
          <h2 class="text-xl font-semibold">Gimnasio</h2>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sesiones totales:</span>
            <span class="font-semibold">0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Esta semana:</span>
            <span class="font-semibold">0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Récords personales:</span>
            <span class="font-semibold">0</span>
          </div>
        </div>
      </div>

      <!-- Running Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <MaterialSymbolsDirectionsRun class="text-2xl mr-2 text-green-600" />
          <h2 class="text-xl font-semibold">Running</h2>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Distancia total:</span>
            <span class="font-semibold">0 km</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Esta semana:</span>
            <span class="font-semibold">0 km</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mejor pace:</span>
            <span class="font-semibold">--:--</span>
          </div>
        </div>
      </div>

      <!-- Overall Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <MaterialSymbolsTarget class="text-2xl mr-2 text-orange-600" />
          <h2 class="text-xl font-semibold">General</h2>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Días activos:</span>
            <span class="font-semibold">0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Racha actual:</span>
            <span class="font-semibold">0 días</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mejor racha:</span>
            <span class="font-semibold">0 días</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mt-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MaterialSymbolsTrendingUpRounded class="text-green-600" />
          Progreso en el Tiempo
        </h2>
        <div class="text-gray-500 text-center py-12">
          Los gráficos aparecerán cuando tengas datos de entrenamientos
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MaterialSymbolsBarChartRounded from "~icons/material-symbols/bar-chart-rounded";
import MaterialSymbolsFitnessCenter from "~icons/material-symbols/fitness-center";
import MaterialSymbolsDirectionsRun from "~icons/material-symbols/directions-run";
import MaterialSymbolsTarget from "~icons/material-symbols/target";
import MaterialSymbolsTrendingUpRounded from "~icons/material-symbols/trending-up-rounded";

useHead({
  title: "Estadísticas - Fit Tracker"
});
</script>