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

        <!-- Calculation Mode Selection -->
        <div class="bg-gray-50 p-3 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">¿Qué campo calcular automáticamente?</label>
          <div class="flex gap-4 text-sm">
            <label class="flex items-center cursor-pointer">
              <input 
                v-model="calculationMode" 
                type="radio" 
                value="distance" 
                class="mr-2"
              >
              <span>Calcular Distancia</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input 
                v-model="calculationMode" 
                type="radio" 
                value="duration" 
                class="mr-2"
              >
              <span>Calcular Duración</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input 
                v-model="calculationMode" 
                type="radio" 
                value="pace" 
                class="mr-2"
              >
              <span>Calcular Pace</span>
            </label>
          </div>
        </div>

        <!-- Basic Metrics -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Distancia (km)
              <span v-if="calculationMode === 'distance'" class="text-blue-600 text-xs ml-1">📊 Calculado</span>
            </label>
            <input 
              v-model.number="formData.distance"
              @input="updateCalculations"
              :readonly="calculationMode === 'distance'"
              type="number" 
              min="0"
              step="0.01"
              placeholder="5.0"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500',
                calculationMode === 'distance' 
                  ? 'bg-blue-50 border-blue-300 text-blue-800 cursor-not-allowed' 
                  : 'border-gray-300'
              ]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Duración (min)
              <span v-if="calculationMode === 'duration'" class="text-blue-600 text-xs ml-1">📊 Calculado</span>
            </label>
            <input 
              v-model.number="formData.duration"
              @input="updateCalculations"
              :readonly="calculationMode === 'duration'"
              type="number" 
              min="1"
              placeholder="30"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500',
                calculationMode === 'duration' 
                  ? 'bg-blue-50 border-blue-300 text-blue-800 cursor-not-allowed' 
                  : 'border-gray-300'
              ]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pace Promedio
              <span v-if="calculationMode === 'pace'" class="text-blue-600 text-xs ml-1">📊 Calculado</span>
            </label>
            <input 
              v-model="formData.average_pace"
              @input="updateCalculations"
              :readonly="calculationMode === 'pace'"
              type="text" 
              placeholder="5:30"
              pattern="[0-9]+:[0-5][0-9]"
              title="Formato: mm:ss (ej: 5:30)"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500',
                calculationMode === 'pace' 
                  ? 'bg-blue-50 border-blue-300 text-blue-800 cursor-not-allowed' 
                  : 'border-gray-300'
              ]"
            >
          </div>
        </div>

        <!-- Tempo Training (only for tempo type) -->
        <div v-if="formData.type === 'tempo'" class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-blue-800 mb-4">Detalles del Tempo</h3>
          
          <!-- Tempo Type Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Tempo</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input 
                  v-model="tempoType" 
                  type="radio" 
                  value="single" 
                  class="mr-2"
                >
                <span class="text-sm">Pace Único</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="tempoType" 
                  type="radio" 
                  value="variable" 
                  class="mr-2"
                >
                <span class="text-sm">Pace Variable (Fondo)</span>
              </label>
            </div>
          </div>

          <!-- Variable Pace Segments -->
          <div v-if="tempoType === 'variable'">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">Segmentos</span>
              <button 
                type="button"
                @click="addTempoSegment"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <IcRoundPlus class="text-sm" />
                Agregar Segmento
              </button>
            </div>

            <div v-if="formData.tempo_segments.length === 0" class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              Agrega segmentos para tu entrenamiento de fondo
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(segment, index) in formData.tempo_segments" 
                :key="index"
                class="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-medium text-sm">Segmento {{ index + 1 }}</span>
                  <button 
                    type="button"
                    @click="removeTempoSegment(index)"
                    class="text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    <MaterialSymbolsClose class="text-sm" />
                  </button>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Duración (min)</label>
                    <input 
                      v-model.number="segment.duration"
                      @input="updateSegmentCalculations(index, 'duration')"
                      type="number" 
                      min="1"
                      placeholder="15"
                      required
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Pace (min/km)</label>
                    <input 
                      v-model="segment.pace"
                      @input="updateSegmentCalculations(index, 'pace')"
                      type="text" 
                      placeholder="4:30"
                      pattern="[0-9]+:[0-5][0-9]"
                      required
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">
                      Distancia (km)
                      <span v-if="isDistanceCalculated(index)" class="text-blue-600 text-xs ml-1">📊</span>
                    </label>
                    <input 
                      v-model.number="segment.distance"
                      @input="updateSegmentCalculations(index, 'distance')"
                      type="number" 
                      min="0"
                      step="0.01"
                      placeholder="3.5"
                      :class="[
                        'w-full px-2 py-1 border rounded text-sm',
                        isDistanceCalculated(index) ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                      ]"
                    >
                  </div>
                </div>

                <div class="mt-2">
                  <label class="block text-xs text-gray-600 mb-1">Notas del segmento</label>
                  <input 
                    v-model="segment.notes"
                    type="text" 
                    placeholder="Sensaciones, condiciones..."
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                </div>
              </div>
            </div>
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
                @input="updateGlobalCalculationsFromIntervals"
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
                @input="updateGlobalCalculationsFromIntervals"
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
                @input="updateGlobalCalculationsFromIntervals"
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
                @change="updateGlobalCalculationsFromRace"
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
                @input="updateGlobalCalculationsFromRace"
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
import IcRoundPlus from "~icons/ic/round-plus";
import MaterialSymbolsClose from "~icons/material-symbols/close";

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
const tempoType = ref('single')
const calculationMode = ref('distance') // Which field to calculate automatically

// Track which fields are calculated automatically
const calculatedSegments = ref(new Set())
const calculatedTotals = ref({
  distance: false,
  duration: false,
  averagePace: false
})

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
  tempo_segments: [],
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

const addTempoSegment = () => {
  formData.value.tempo_segments.push({
    duration: null,
    distance: null,
    pace: '',
    notes: ''
  })
}

const removeTempoSegment = (index) => {
  formData.value.tempo_segments.splice(index, 1)
  calculatedSegments.value.delete(`${index}-distance`)
  updateTotalCalculations()
}

// Import pace calculation utilities
const { 
  calculateDistance, 
  calculatePace, 
  calculateTime,
  calculateAveragePace,
  calculateTotalDistance,
  calculateTotalTime
} = await import('~/utils/paceCalculations')

// Check if a segment's distance is calculated
const isDistanceCalculated = (index) => {
  return calculatedSegments.value.has(`${index}-distance`)
}

// Update calculations for a specific segment
const updateSegmentCalculations = (index, changedField) => {
  const segment = formData.value.tempo_segments[index]
  if (!segment) return

  // Clear any previous calculation flags for this segment
  calculatedSegments.value.delete(`${index}-distance`)
  calculatedSegments.value.delete(`${index}-pace`)
  calculatedSegments.value.delete(`${index}-duration`)

  if (changedField === 'duration' || changedField === 'pace') {
    // If we have duration and pace, calculate distance
    if (segment.duration && segment.pace) {
      const calculatedDistance = calculateDistance(segment.duration, segment.pace)
      if (calculatedDistance) {
        segment.distance = calculatedDistance
        calculatedSegments.value.add(`${index}-distance`)
      }
    }
  } else if (changedField === 'distance') {
    // If distance was manually changed, don't auto-calculate it anymore
    if (segment.duration && segment.distance) {
      const calculatedPace = calculatePace(segment.distance, segment.duration)
      if (calculatedPace) {
        segment.pace = calculatedPace
        calculatedSegments.value.add(`${index}-pace`)
      }
    }
  }

  // Update totals after any segment change
  updateTotalCalculations()
}

// Update total calculations based on segments (for tempo variable)
const updateTotalCalculations = () => {
  if (formData.value.type !== 'tempo' || tempoType.value !== 'variable') {
    // Don't auto-calculate for other types here - they have their own handlers
    return
  }

  const segments = formData.value.tempo_segments
  if (!segments || segments.length === 0) {
    calculatedTotals.value = { distance: false, duration: false, averagePace: false }
    return
  }

  // Calculate total distance
  const totalDistance = calculateTotalDistance(segments)
  if (totalDistance > 0) {
    formData.value.distance = totalDistance
    calculatedTotals.value.distance = true
  }

  // Calculate total duration
  const totalDuration = calculateTotalTime(segments)
  if (totalDuration > 0) {
    formData.value.duration = totalDuration
    calculatedTotals.value.duration = true
  }

  // Calculate average pace
  const avgPace = calculateAveragePace(segments)
  if (avgPace) {
    formData.value.average_pace = avgPace
    calculatedTotals.value.averagePace = true
  }
}

// New simplified calculation handler
const updateCalculations = () => {
  // Don't auto-calculate if we're in tempo variable mode (handled separately)
  if (formData.value.type === 'tempo' && tempoType.value === 'variable') {
    return
  }

  const { distance, duration, average_pace } = formData.value

  // Calculate based on selected mode
  if (calculationMode.value === 'distance') {
    // Calculate distance from duration + pace
    if (duration && average_pace) {
      const calculatedDistance = calculateDistance(duration, average_pace)
      if (calculatedDistance) {
        formData.value.distance = calculatedDistance
      }
    }
  } else if (calculationMode.value === 'duration') {
    // Calculate duration from distance + pace
    if (distance && average_pace) {
      const calculatedDuration = calculateTime(distance, average_pace)
      if (calculatedDuration) {
        formData.value.duration = calculatedDuration
      }
    }
  } else if (calculationMode.value === 'pace') {
    // Calculate pace from distance + duration
    if (distance && duration) {
      const calculatedPace = calculatePace(distance, duration)
      if (calculatedPace) {
        formData.value.average_pace = calculatedPace
      }
    }
  }
}

// Calculate globals from intervals data
const updateGlobalCalculationsFromIntervals = () => {
  const { distance, repetitions, time } = formData.value.intervals
  
  if (distance && repetitions && time) {
    // Calculate total distance (convert meters to km)
    const totalDistance = (distance * repetitions) / 1000
    formData.value.distance = Math.round(totalDistance * 100) / 100
    calculatedTotals.value.distance = true

    // Calculate total duration (convert time per interval to total minutes)
    const timeMinutes = time.split(':').reduce((acc, time) => (60 * acc) + +time, 0) / 60
    const totalDuration = timeMinutes * repetitions
    formData.value.duration = Math.round(totalDuration * 100) / 100
    calculatedTotals.value.duration = true

    // Calculate average pace (same as interval pace for this type)
    const distanceKm = distance / 1000
    const avgPace = calculatePace(distanceKm, timeMinutes)
    if (avgPace) {
      formData.value.average_pace = avgPace
      calculatedTotals.value.averagePace = true
    }
  }
}

// Convert race time format (h:mm:ss) to minutes
const raceTimeToMinutes = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) return null
  
  const parts = timeStr.split(':').map(Number)
  if (parts.length === 3) {
    // h:mm:ss format
    const [hours, minutes, seconds] = parts
    return hours * 60 + minutes + seconds / 60
  } else if (parts.length === 2) {
    // mm:ss format
    const [minutes, seconds] = parts
    return minutes + seconds / 60
  }
  return null
}

// Calculate globals from race data
const updateGlobalCalculationsFromRace = () => {
  const { distance, official_time } = formData.value.race
  
  if (distance && official_time) {
    // Set distance
    formData.value.distance = distance
    calculatedTotals.value.distance = true

    // Calculate duration
    const durationMinutes = raceTimeToMinutes(official_time)
    if (durationMinutes) {
      formData.value.duration = Math.round(durationMinutes * 100) / 100
      calculatedTotals.value.duration = true

      // Calculate average pace
      const avgPace = calculatePace(distance, durationMinutes)
      if (avgPace) {
        formData.value.average_pace = avgPace
        calculatedTotals.value.averagePace = true
      }
    }
  }
}

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
    tempo_segments: [],
    race: {
      name: '',
      distance: null,
      official_time: '',
      placement: null
    },
    notes: '',
    perceived_effort: 5
  }
  tempoType.value = 'single'
  calculationMode.value = 'distance'
  calculatedSegments.value.clear()
  calculatedTotals.value = { distance: false, duration: false, averagePace: false }
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
    
    // Handle tempo segments for tempo type
    if (sessionData.type === 'tempo') {
      if (tempoType.value === 'single' || !sessionData.tempo_segments || sessionData.tempo_segments.length === 0) {
        delete sessionData.tempo_segments
      }
    } else {
      delete sessionData.tempo_segments
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

// Add initial tempo segment when switching to tempo variable mode
watch(tempoType, (newType) => {
  if (newType === 'variable' && formData.value.tempo_segments.length === 0) {
    addTempoSegment()
  }
  // Update calculations when switching tempo types
  updateTotalCalculations()
})

// Watch for changes in tempo segments to update totals
watch(() => formData.value.tempo_segments, () => {
  updateTotalCalculations()
}, { deep: true })

// Watch for changes in workout type to clear calculations
watch(() => formData.value.type, () => {
  calculatedTotals.value = { distance: false, duration: false, averagePace: false }
})

// Watch for changes in intervals data
watch(() => formData.value.intervals, () => {
  if (formData.value.type === 'intervals') {
    updateGlobalCalculationsFromIntervals()
  }
}, { deep: true })

// Watch for changes in race data
watch(() => formData.value.race, () => {
  if (formData.value.type === 'race') {
    updateGlobalCalculationsFromRace()
  }
}, { deep: true })

// Watch for changes in calculation mode to trigger recalculation
watch(calculationMode, () => {
  updateCalculations()
})
</script>