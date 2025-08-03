<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <MaterialSymbolsExercise class="text-orange-600" />
        Ejercicios
      </h1>
      <p class="text-gray-600">Gestiona tu base de datos de ejercicios</p>
    </div>

    <div class="grid gap-6">
      <!-- Add Exercise -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Agregar Nuevo Ejercicio</h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
          <IcRoundPlus class="text-lg" />
          Crear Ejercicio
        </button>
      </div>

      <!-- Exercise Categories -->
      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <MaterialSymbolsFitnessCenter class="text-blue-600" />
            Fuerza
          </h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de fuerza aún
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <MaterialSymbolsFavorite class="text-red-600" />
            Cardio
          </h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de cardio aún
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <MaterialSymbolsAccessibility class="text-green-600" />
            Peso Corporal
          </h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de peso corporal aún
          </div>
        </div>
      </div>

      <!-- Popular Exercises -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MaterialSymbolsStarRounded class="text-yellow-600" />
          Ejercicios Populares
        </h2>
        <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div class="text-gray-500 text-center py-8 md:col-span-2 lg:col-span-3">
            Agregar ejercicios predefinidos aquí
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MaterialSymbolsExercise from "~icons/material-symbols/exercise";
import IcRoundPlus from "~icons/ic/round-plus";
import MaterialSymbolsFitnessCenter from "~icons/material-symbols/fitness-center";
import MaterialSymbolsFavorite from "~icons/material-symbols/favorite";
import MaterialSymbolsAccessibility from "~icons/material-symbols/accessibility";
import MaterialSymbolsStarRounded from "~icons/material-symbols/star-rounded";

useHead({
  title: "Ejercicios - Fit Tracker"
});
</script>