<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">💪 Ejercicios</h1>
      <p class="text-gray-600">Gestiona tu base de datos de ejercicios</p>
    </div>

    <div class="grid gap-6">
      <!-- Add Exercise -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Agregar Nuevo Ejercicio</h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          ➕ Crear Ejercicio
        </button>
      </div>

      <!-- Exercise Categories -->
      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">💪 Fuerza</h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de fuerza aún
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">❤️ Cardio</h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de cardio aún
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">🤸‍♂️ Peso Corporal</h3>
          <div class="text-gray-500 text-center py-4">
            No hay ejercicios de peso corporal aún
          </div>
        </div>
      </div>

      <!-- Popular Exercises -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Ejercicios Populares</h2>
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
useHead({
  title: "Ejercicios - Fit Tracker"
});
</script>