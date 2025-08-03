import type { BaseDocument } from './firestore.types'

export interface Exercise extends BaseDocument {
  name: string
  category: 'strength' | 'cardio' | 'bodyweight'
  muscle_groups: string[]
  isCustom: boolean
}

export interface Set {
  reps: number
  weight: number
  rest_time?: number
}

export interface WorkoutExercise {
  exercise_id: string
  sets: Set[]
  notes?: string
}

export interface GymSession extends BaseDocument {
  date: string
  exercises: WorkoutExercise[]
  duration?: number
  notes?: string
}