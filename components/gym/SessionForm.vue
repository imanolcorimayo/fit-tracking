<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold">Nueva Sesión de Gimnasio</h2>
        <button 
          @click="closeForm"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Date and Duration -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input 
              v-model="formData.date"
              type="date" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Duración (min)</label>
            <input 
              v-model.number="formData.duration"
              type="number" 
              min="1"
              placeholder="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Exercises -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700">Ejercicios</label>
            <button 
              type="button"
              @click="addExercise"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <IcRoundPlus class="text-sm" />
              Agregar Ejercicio
            </button>
          </div>

          <div v-if="formData.exercises.length === 0" class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
            Agrega ejercicios para comenzar tu sesión
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(exercise, exerciseIndex) in formData.exercises" 
              :key="exerciseIndex"
              class="border border-gray-200 rounded-lg p-4"
            >
              <!-- Exercise Header -->
              <div class="flex items-center justify-between mb-3">
                <input 
                  v-model="exercise.exercise_id"
                  placeholder="Nombre del ejercicio"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button 
                  type="button"
                  @click="removeExercise(exerciseIndex)"
                  class="ml-2 text-red-600 hover:text-red-800 px-2 py-1"
                >
                  <MaterialSymbolsDelete class="text-lg" />
                </button>
              </div>

              <!-- Sets -->
              <div class="mb-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Series</span>
                  <button 
                    type="button"
                    @click="addSet(exerciseIndex)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    + Serie
                  </button>
                </div>

                <div v-if="exercise.sets.length === 0" class="text-gray-500 text-sm">
                  No hay series agregadas
                </div>

                <div v-else class="space-y-2">
                  <div 
                    v-for="(set, setIndex) in exercise.sets" 
                    :key="setIndex"
                    class="flex items-center gap-2 bg-gray-50 p-2 rounded"
                  >
                    <span class="text-sm font-medium w-8">{{ setIndex + 1 }}:</span>
                    
                    <div class="flex items-center gap-1">
                      <input 
                        v-model.number="set.reps"
                        type="number" 
                        min="1"
                        placeholder="10"
                        required
                        class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      >
                      <span class="text-xs text-gray-600">reps</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <input 
                        v-model.number="set.weight"
                        type="number" 
                        min="0"
                        step="0.5"
                        placeholder="80"
                        required
                        class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      >
                      <span class="text-xs text-gray-600">kg</span>
                    </div>

                    <button 
                      type="button"
                      @click="removeSet(exerciseIndex, setIndex)"
                      class="text-red-600 hover:text-red-800 ml-auto"
                    >
                      <MaterialSymbolsClose class="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Exercise Notes -->
              <div>
                <label class="block text-sm text-gray-600 mb-1">Notas del ejercicio</label>
                <textarea 
                  v-model="exercise.notes"
                  rows="2"
                  placeholder="Observaciones sobre este ejercicio..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- General Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Notas generales</label>
          <textarea 
            v-model="formData.notes"
            rows="3"
            placeholder="Observaciones generales de la sesión..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            :disabled="loading || formData.exercises.length === 0"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {{ loading ? 'Guardando...' : 'Guardar Sesión' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import IcRoundPlus from "~icons/ic/round-plus";
import MaterialSymbolsDelete from "~icons/material-symbols/delete";
import MaterialSymbolsClose from "~icons/material-symbols/close";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const gymStore = useGymStore()
const loading = ref(false)

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  duration: null,
  exercises: [],
  notes: ''
})

const addExercise = () => {
  formData.value.exercises.push({
    exercise_id: '',
    sets: [],
    notes: ''
  })
}

const removeExercise = (index) => {
  formData.value.exercises.splice(index, 1)
}

const addSet = (exerciseIndex) => {
  formData.value.exercises[exerciseIndex].sets.push({
    reps: null,
    weight: null
  })
}

const removeSet = (exerciseIndex, setIndex) => {
  formData.value.exercises[exerciseIndex].sets.splice(setIndex, 1)
}

const resetForm = () => {
  formData.value = {
    date: new Date().toISOString().split('T')[0],
    duration: null,
    exercises: [],
    notes: ''
  }
}

const closeForm = () => {
  resetForm()
  emit('close')
}

const submitForm = async () => {
  loading.value = true
  
  try {
    const sessionId = await gymStore.createSession(formData.value)
    
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

// Add initial exercise when form opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && formData.value.exercises.length === 0) {
    addExercise()
  }
})
</script>