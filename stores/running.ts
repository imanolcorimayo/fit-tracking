import { defineStore } from 'pinia'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import type { RunningSession } from '~/stores/types/running.types'

export const useRunningStore = defineStore('running', () => {
  const sessions = ref<RunningSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const db = useFirestore()
  const { user } = useCurrentUser()

  // Create a new running session
  const createSession = async (sessionData: Omit<RunningSession, 'id' | 'userUid' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!db || !user.value) {
      error.value = 'Database or user not available'
      return null
    }

    try {
      loading.value = true
      error.value = null

      const now = Timestamp.now()
      const newSession: Omit<RunningSession, 'id'> = {
        ...sessionData,
        userUid: user.value.uid,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, 'running_sessions'), newSession)
      
      // Add the session to local state
      const sessionWithId: RunningSession = {
        ...newSession,
        id: docRef.id
      }
      sessions.value.unshift(sessionWithId)

      return docRef.id
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create session'
      return null
    } finally {
      loading.value = false
    }
  }

  // Get all sessions for the current user
  const fetchSessions = async (limitCount?: number): Promise<void> => {
    if (!db || !user.value) {
      error.value = 'Database or user not available'
      return
    }

    try {
      loading.value = true
      error.value = null

      let q = query(
        collection(db, 'running_sessions'),
        where('userUid', '==', user.value.uid),
        orderBy('createdAt', 'desc')
      )

      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      sessions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RunningSession))

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sessions'
    } finally {
      loading.value = false
    }
  }

  // Get a specific session by ID
  const getSession = async (sessionId: string): Promise<RunningSession | null> => {
    if (!db || !user.value) {
      error.value = 'Database or user not available'
      return null
    }

    try {
      const docRef = doc(db, 'running_sessions', sessionId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as RunningSession
      }

      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get session'
      return null
    }
  }

  // Update an existing session
  const updateSession = async (sessionId: string, updates: Partial<Omit<RunningSession, 'id' | 'userUid' | 'createdAt'>>): Promise<boolean> => {
    if (!db || !user.value) {
      error.value = 'Database or user not available'
      return false
    }

    try {
      loading.value = true
      error.value = null

      const sessionRef = doc(db, 'running_sessions', sessionId)
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })

      // Update local state
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex] = {
          ...sessions.value[sessionIndex],
          ...updates,
          updatedAt: Timestamp.now()
        }
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update session'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete a session
  const deleteSession = async (sessionId: string): Promise<boolean> => {
    if (!db || !user.value) {
      error.value = 'Database or user not available'
      return false
    }

    try {
      loading.value = true
      error.value = null

      await deleteDoc(doc(db, 'running_sessions', sessionId))

      // Remove from local state
      sessions.value = sessions.value.filter(s => s.id !== sessionId)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete session'
      return false
    } finally {
      loading.value = false
    }
  }

  // Get recent sessions (last 5)
  const getRecentSessions = computed(() => {
    return sessions.value.slice(0, 5)
  })

  // Get total sessions count
  const totalSessions = computed(() => {
    return sessions.value.length
  })

  // Get sessions from current week
  const weekSessions = computed(() => {
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    weekStart.setHours(0, 0, 0, 0)

    return sessions.value.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekStart
    })
  })

  // Get total distance run
  const totalDistance = computed(() => {
    return sessions.value.reduce((total, session) => {
      return total + (session.distance || 0)
    }, 0)
  })

  // Get distance run this week
  const weekDistance = computed(() => {
    return weekSessions.value.reduce((total, session) => {
      return total + (session.distance || 0)
    }, 0)
  })

  // Get best pace
  const bestPace = computed(() => {
    const paceSessions = sessions.value.filter(s => s.average_pace)
    if (paceSessions.length === 0) return null
    
    // Convert pace strings to seconds for comparison
    const paceToSeconds = (pace: string) => {
      const [minutes, seconds] = pace.split(':').map(Number)
      return minutes * 60 + seconds
    }
    
    const bestSession = paceSessions.reduce((best, current) => {
      const bestPaceSeconds = paceToSeconds(best.average_pace!)
      const currentPaceSeconds = paceToSeconds(current.average_pace!)
      return currentPaceSeconds < bestPaceSeconds ? current : best
    })
    
    return bestSession.average_pace
  })

  // Clear all data (useful for logout)
  const clearData = () => {
    sessions.value = []
    error.value = null
    loading.value = false
  }

  return {
    // State
    sessions: readonly(sessions),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    createSession,
    fetchSessions,
    getSession,
    updateSession,
    deleteSession,
    clearData,

    // Getters
    getRecentSessions,
    totalSessions,
    weekSessions,
    totalDistance,
    weekDistance,
    bestPace
  }
})