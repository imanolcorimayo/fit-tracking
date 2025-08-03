<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold">
          {{ formTitle }}
        </h2>
        <button 
          @click="closeForm"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Date and Type -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input 
              v-model="formData.date"
              type="date" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Entrenamiento</label>
            <select 
              v-model="formData.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="easy_run">Carrera Fácil</option>
              <option value="intervals">Intervalos</option>
              <option value="tempo">Tempo</option>
              <option value="long_run">Tirada Larga</option>
              <option value="race">Carrera/Competición</option>
            </select>
          </div>
        </div>

        <!-- Basic Metrics -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Distancia (km)</label>
            <input 
              v-model.number="formData.distance"
              type="number" 
              min="0"
              step="0.1"
              placeholder="5.0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Duración (min)</label>
            <input 
              v-model.number="formData.duration"
              type="number" 
              min="1"
              placeholder="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pace Promedio</label>
            <input 
              v-model="formData.average_pace"
              type="text" 
              placeholder="5:30"
              pattern="[0-9]+:[0-5][0-9]"
              title="Formato: mm:ss (ej: 5:30)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
        </div>

        <!-- Interval Training (only for intervals type) -->
        <div v-if="formData.type === 'intervals'" class="bg-orange-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-orange-800 mb-4">Detalles de Intervalos</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Distancia por Intervalo (m)</label>
              <input 
                v-model.number="formData.intervals.distance"
                type="number" 
                min="100"
                step="50"
                placeholder="400"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Repeticiones</label>
              <input 
                v-model.number="formData.intervals.repetitions"
                type="number" 
                min="1"
                placeholder="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo por Intervalo</label>
              <input 
                v-model="formData.intervals.time"
                type="text" 
                placeholder="1:30"
                pattern="[0-9]+:[0-5][0-9]"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descanso</label>
              <input 
                v-model="formData.intervals.rest_time"
                type="text" 
                placeholder="1:00"
                pattern="[0-9]+:[0-5][0-9]"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
            </div>
          </div>
        </div>

        <!-- Race Details (only for race type) -->
        <div v-if="formData.type === 'race'" class="bg-red-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-red-800 mb-4">Detalles de la Carrera</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Carrera</label>
              <input 
                v-model="formData.race.name"
                type="text" 
                placeholder="Maratón de Madrid"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Distancia Oficial (km)</label>
              <select 
                v-model.number="formData.race.distance"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="5">5K</option>
                <option value="10">10K</option>
                <option value="15">15K</option>
                <option value="21.1">Media Maratón</option>
                <option value="42.2">Maratón</option>
                <option value="">Otra distancia</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo Oficial</label>
              <input 
                v-model="formData.race.official_time"
                type="text" 
                placeholder="1:45:30"
                pattern="[0-9]+:[0-5][0-9]:[0-5][0-9]"
                title="Formato: h:mm:ss"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Posición (opcional)</label>
              <input 
                v-model.number="formData.race.placement"
                type="number" 
                min="1"
                placeholder="150"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
            </div>
          </div>
        </div>

        <!-- Perceived Effort -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Esfuerzo Percibido (1-10)</label>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Fácil</span>
            <input 
              v-model.number="formData.perceived_effort"
              type="range" 
              min="1"
              max="10"
              class="flex-1"
            >
            <span class="text-sm text-gray-500">Muy Duro</span>
            <span class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium min-w-[2rem] text-center">
              {{ formData.perceived_effort || '-' }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Notas</label>
          <textarea 
            v-model="formData.notes"
            rows="3"
            placeholder="¿Cómo te sentiste? Condiciones del clima, sensaciones..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button"
            @click="closeForm"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {{ loading ? 'Guardando...' : 'Guardar Sesión' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialType: {
    type: String,
    default: 'easy_run'
  }
})

const emit = defineEmits(['close', 'success'])

const runningStore = useRunningStore()
const loading = ref(false)

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  type: props.initialType,
  distance: null,
  duration: null,
  average_pace: '',
  intervals: {
    distance: null,
    time: '',
    rest_time: '',
    repetitions: null
  },
  race: {
    name: '',
    distance: null,
    official_time: '',
    placement: null
  },
  notes: '',
  perceived_effort: 5
})

const formTitle = computed(() => {
  const titles = {
    easy_run: 'Nueva Carrera Fácil',
    intervals: 'Nuevo Entrenamiento de Intervalos',
    tempo: 'Nuevo Entrenamiento Tempo',
    long_run: 'Nueva Tirada Larga',
    race: 'Nueva Carrera/Competición'
  }
  return titles[formData.value.type] || 'Nueva Sesión de Running'
})

const resetForm = () => {
  formData.value = {
    date: new Date().toISOString().split('T')[0],
    type: props.initialType,
    distance: null,
    duration: null,
    average_pace: '',
    intervals: {
      distance: null,
      time: '',
      rest_time: '',
      repetitions: null
    },
    race: {
      name: '',
      distance: null,
      official_time: '',
      placement: null
    },
    notes: '',
    perceived_effort: 5
  }
}

const closeForm = () => {
  resetForm()
  emit('close')
}

const submitForm = async () => {
  loading.value = true
  
  try {
    // Clean up data before submission
    const sessionData = { ...formData.value }
    
    // Remove empty intervals if not intervals type
    if (sessionData.type !== 'intervals') {
      delete sessionData.intervals
    }
    
    // Remove empty race data if not race type
    if (sessionData.type !== 'race') {
      delete sessionData.race
    }
    
    // Remove empty strings and null values
    Object.keys(sessionData).forEach(key => {
      if (sessionData[key] === '' || sessionData[key] === null) {
        delete sessionData[key]
      }
    })
    
    const sessionId = await runningStore.createSession(sessionData)
    
    if (sessionId) {
      emit('success')
      closeForm()
    }
  } catch (error) {
    console.error('Error creating session:', error)
  } finally {
    loading.value = false
  }
}

// Update form type when initialType prop changes
watch(() => props.initialType, (newType) => {
  formData.value.type = newType
})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    formData.value.type = props.initialType
  }
})
</script>