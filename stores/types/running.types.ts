import type { BaseDocument } from './firestore.types'

export interface RunningSession extends BaseDocument {
  date: string
  type: 'easy_run' | 'intervals' | 'tempo' | 'long_run' | 'race'
  
  // Basic metrics
  distance?: number
  duration?: number
  average_pace?: string
  
  // Specific training data
  intervals?: {
    distance: number
    time: string
    rest_time: string
    repetitions: number
  }
  
  // Race data
  race?: {
    name: string
    distance: number
    official_time: string
    placement?: number
  }
  
  notes?: string
  perceived_effort?: number
}