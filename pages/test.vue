<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-900 mb-4">Test Page</h1>
      <p class="text-blue-700">This page should load without any middleware or Firebase</p>
      <div class="mt-4">
        <NuxtLink to="/welcome" class="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Welcome
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

useHead({
  title: "Test Page"
});
</script>