<template>
  <div>
    <div
      class="container flex flex-col justify-center align-center gap-8 h-[90vh] max-w-[80rem] px-6 m-auto"
    >
      <div class="w-full flex flex-col items-center align-center gap-4">
        <div class="text-6xl">🏋️‍♂️</div>
        <h1 class="text-3xl font-bold text-center">Fit Tracker</h1>
        <p class="text-gray-600 text-center">Tu aplicación personal de seguimiento de entrenamientos</p>
      </div>
      
      <div class="flex flex-col justify-center gap-2 text-center">
        <h2 class="text-2xl font-semibold">¡Bienvenido! 💪</h2>
        <span class="text-gray-600 text-lg">Inicia sesión para comenzar a trackear tus entrenamientos</span>
      </div>
      
      <div class="flex flex-col items-center">
        <button 
          class="w-full max-w-80 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" 
          @click="googleSignIn"
          :disabled="loading"
        >
          <div class="flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión con Google' }}</span>
          </div>
        </button>
        
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error al iniciar sesión. Por favor, inténtalo de nuevo.
        </div>
      </div>
      
      <div class="text-center text-sm text-gray-500">
        <p>🏃‍♂️ Trackea tus entrenamientos de gimnasio</p>
        <p>⏱️ Registra tus tiempos de running</p>
        <p>📊 Visualiza tu progreso y récords personales</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

definePageMeta({
  layout: false
});

const googleAuthProvider = new GoogleAuthProvider();

// ---- Define Vars ----------
const auth = useFirebaseAuth();
const route = useRoute();
const error = ref(false);
const loading = ref(false);

// ---- Define Methods ----------
function googleSignIn() {
  if (!auth) return;
  
  loading.value = true;
  error.value = false;
  
  signInWithPopup(auth, googleAuthProvider)
    .then((result) => {
      // Si es exitoso, redirigir a la página de gimnasio o redirect query
      navigateTo(route.query && route.query.redirect ? route.query.redirect : "/gym");
    })
    .catch((reason) => {
      console.error("Error al iniciar sesión", reason);
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

useHead({
  title: "Bienvenido a Fit Tracker",
  meta: [
    {
      name: "description",
      content: "Aplicación personal para el seguimiento de entrenamientos de gimnasio y running"
    }
  ]
});
</script>