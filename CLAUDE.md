# Fitness Tracker App

## Project Overview
A minimalist fitness tracking application for personal use, focusing on gym workouts and running sessions with efficient data storage and progress tracking.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3)
- **State Management**: Pinia (Nuxt 3 default)
- **Backend**: Firebase (Firestore Database)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Styling**: Tailwind CSS (to be added)
- **Charts**: Chart.js or similar lightweight library

## TypeScript Interfaces

### Base Firestore Document
```typescript
interface BaseDocument {
  id: string
  userUid: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Gym Workouts
```typescript
interface Exercise extends BaseDocument {
  name: string
  category: 'strength' | 'cardio' | 'bodyweight'
  muscle_groups: string[]
  isCustom: boolean // User-created vs predefined
}

interface Set {
  reps: number
  weight: number // in kg
  rest_time?: number // in seconds
}

interface WorkoutExercise {
  exercise_id: string
  sets: Set[]
  notes?: string
}

interface GymSession extends BaseDocument {
  date: string // ISO date
  exercises: WorkoutExercise[]
  duration?: number // in minutes
  notes?: string
}
```

### Running Workouts
```typescript
interface RunningSession extends BaseDocument {
  date: string // ISO date
  type: 'easy_run' | 'intervals' | 'tempo' | 'long_run' | 'race'
  
  // Basic metrics
  distance?: number // in km
  duration?: number // in minutes
  average_pace?: string // mm:ss format per km
  
  // Specific training data
  intervals?: {
    distance: number // in meters
    time: string // mm:ss
    rest_time: string // mm:ss
    repetitions: number
  }
  
  // Race data
  race?: {
    name: string
    distance: number // 5, 10, 15, 21.1, 42.2, etc.
    official_time: string // HH:mm:ss
    placement?: number
  }
  
  notes?: string
  perceived_effort?: number // 1-10 scale
}
```

### Statistics & Personal Records
```typescript
interface PersonalRecord extends BaseDocument {
  type: 'gym' | 'running'
  exercise_id?: string // For gym PRs
  distance?: number // For running PRs (in km)
  value: number // Weight for gym, time in seconds for running
  date: string // ISO date when achieved
  session_id: string // Reference to the session
}

interface UserSettings extends BaseDocument {
  units: {
    weight: 'kg' | 'lbs'
    distance: 'km' | 'miles'
    pace: 'min_per_km' | 'min_per_mile'
  }
  default_exercises: string[] // Frequently used exercise IDs
}
```

## App Structure

### Pages
1. **Dashboard** (`/`) - Resumen rápido, actividades recientes, objetivos
2. **Gimnasio** (`/gym`) - Registrar sesiones de gimnasio, historial de ejercicios
3. **Running** (`/running`) - Registrar carreras, progreso de running
4. **Estadísticas** (`/stats`) - Récords personales, gráficos de progreso
5. **Ejercicios** (`/exercises`) - Gestionar base de datos de ejercicios

### Components Structure
```
components/
├── gym/
│   ├── SessionLogger.vue      # Registro rápido de sesión de gimnasio
│   ├── ExerciseSelector.vue   # Selector de ejercicios con búsqueda
│   ├── SetTracker.vue         # Registro de series individuales
│   └── WorkoutHistory.vue     # Lista de entrenamientos pasados
├── running/
│   ├── RunLogger.vue          # Registro rápido de carrera
│   ├── IntervalTracker.vue    # Registro de entrenamientos por intervalos
│   ├── RaceLogger.vue         # Registro de resultados de carreras
│   └── RunHistory.vue         # Lista de carreras pasadas
├── stats/
│   ├── PRDisplay.vue          # Mostrar récords personales
│   ├── ProgressChart.vue      # Gráficos de progreso en el tiempo
│   └── StatsCards.vue         # Tarjetas de métricas clave
└── ui/
    ├── QuickAction.vue        # Botones de acción rápida
    ├── DatePicker.vue         # Selección de fecha
    └── TimePicker.vue         # Entrada de tiempo/duración
```

### Store Architecture (Pinia)
```
stores/
├── auth.ts                    # Estado y métodos de Firebase Auth
├── gym.ts                     # CRUD y estado de sesiones de gimnasio
├── running.ts                 # CRUD y estado de sesiones de running
├── exercises.ts               # Gestión de definiciones de ejercicios
├── stats.ts                   # Récords personales y estadísticas
└── types/
    ├── gym.types.ts          # Interfaces GymSession, Exercise
    ├── running.types.ts      # Interfaces RunningSession
    ├── stats.types.ts        # Interfaces PR y estadísticas
    └── firestore.types.ts    # Interfaces base de documentos Firestore
```

## Key Features

### Quick Entry System
- **Gym**: Template-based workouts for common routines
- **Running**: One-tap logging for standard run types
- **Smart defaults**: Remember last weights, common distances
- **Voice notes**: Quick audio notes for sessions

### Personal Records Tracking
- **Gym PRs**: Max weight per exercise (1RM, 3RM, 5RM)
- **Running PRs**: Best times per distance (5K, 10K, half marathon, etc.)
- **Progress indicators**: Visual cues for new PRs or improvements

### Minimal Data Storage
- Store only essential metrics
- Calculate derived metrics on-demand
- Use efficient data structures
- Local storage with export capability

## Development Guidelines

### Data Storage Strategy
- Use Firebase Firestore for persistence and real-time sync
- Implement Firebase security rules for user data isolation
- Structure collections: users/{userUid}/gym_sessions and users/{userUid}/running_sessions
- Cache calculated metrics (PRs, totals) for performance
- Offline support with Firestore caching

### UI/UX Principles
- Mobile-first design (thumb-friendly)
- Maximum 3 taps to log a workout
- Use sensible defaults and auto-completion
- Minimal cognitive load during workout

### Performance Considerations
- Lazy load historical data with Firestore pagination
- Virtual scrolling for large datasets
- Debounced inputs for real-time calculations
- Offline-first approach with Firestore caching
- Firebase Auth persistence for seamless login

## Implementation Phases

### Phase 1: Firebase Setup & Authentication
- Configure Firebase project and Firestore
- Set up Firebase Authentication (Google/Email)
- Implement authentication middleware and guards
- Create user-specific data structure

### Phase 2: Gym Tracking
- Exercise database setup
- Workout logging interface
- Basic PR calculation

### Phase 3: Running Tracking
- Run logging interface
- Interval and race tracking
- Running-specific PRs

### Phase 4: Statistics & Analytics
- Charts and progress visualization
- Comprehensive PR tracking
- Export/import functionality

### Phase 5: Deployment & Polish
- Configure Firebase Hosting
- Set up Firebase security rules
- Performance optimization
- UI/UX improvements
- Mobile optimization

## Firestore Database Structure
```
users/{userUid}/
├── gym_sessions/{sessionId}     # GymSession documents
├── running_sessions/{sessionId} # RunningSession documents
├── exercises/{exerciseId}       # Exercise documents (custom + predefined)
├── personal_records/{recordId}  # PersonalRecord documents
└── settings/preferences         # UserSettings document
```

### Store-Based Architecture
- **ALL Firestore operations handled in Pinia stores**
- Each collection has dedicated store with TypeScript interfaces
- Stores handle CRUD operations, caching, and state management
- Components only interact with stores, never directly with Firestore

### Security Rules
- All data scoped to authenticated user's UID
- Users can only access their own data
- Read/write permissions tied to Firebase Auth

## Development Commands
```bash
# Development
yarn dev

# Build
yarn build

# Generate static site
yarn generate

# Preview build
yarn preview

# Firebase commands
firebase login
firebase init
firebase deploy
firebase emulators:start
```

## Notes
- This is a personal project focused on simplicity and efficiency
- **UI language: Spanish** - All interface elements, labels, and messages in Spanish
- Prioritize speed of data entry over complex features
- Firebase provides real-time sync and offline support
- User authentication ensures data privacy and security