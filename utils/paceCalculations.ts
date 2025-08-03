/**
 * Utility functions for running pace calculations
 */

/**
 * Convert pace string (mm:ss) to seconds per km
 */
export function paceToSeconds(pace: string): number | null {
  if (!pace || !pace.includes(':')) return null
  
  const [minutes, seconds] = pace.split(':').map(Number)
  if (isNaN(minutes) || isNaN(seconds)) return null
  
  return minutes * 60 + seconds
}

/**
 * Convert seconds per km to pace string (mm:ss)
 */
export function secondsToPace(seconds: number): string {
  if (!seconds || seconds <= 0) return ''
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calculate distance based on time (minutes) and pace (mm:ss per km)
 */
export function calculateDistance(timeMinutes: number, pace: string): number | null {
  if (!timeMinutes || timeMinutes <= 0 || !pace) return null
  
  const paceSeconds = paceToSeconds(pace)
  if (!paceSeconds) return null
  
  const timeSeconds = timeMinutes * 60
  const distance = timeSeconds / paceSeconds
  
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate pace based on distance (km) and time (minutes)
 */
export function calculatePace(distance: number, timeMinutes: number): string | null {
  if (!distance || distance <= 0 || !timeMinutes || timeMinutes <= 0) return null
  
  const timeSeconds = timeMinutes * 60
  const paceSeconds = timeSeconds / distance
  
  return secondsToPace(paceSeconds)
}

/**
 * Calculate time based on distance (km) and pace (mm:ss per km)
 */
export function calculateTime(distance: number, pace: string): number | null {
  if (!distance || distance <= 0 || !pace) return null
  
  const paceSeconds = paceToSeconds(pace)
  if (!paceSeconds) return null
  
  const totalSeconds = distance * paceSeconds
  const timeMinutes = totalSeconds / 60
  
  return Math.round(timeMinutes * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate average pace from multiple segments
 */
export function calculateAveragePace(segments: Array<{duration: number, distance?: number, pace?: string}>): string | null {
  if (!segments || segments.length === 0) return null
  
  let totalDistance = 0
  let totalTime = 0
  
  for (const segment of segments) {
    if (!segment.duration) continue
    
    let segmentDistance = segment.distance
    
    // If no distance but has pace, calculate distance
    if (!segmentDistance && segment.pace) {
      segmentDistance = calculateDistance(segment.duration, segment.pace)
    }
    
    if (segmentDistance) {
      totalDistance += segmentDistance
      totalTime += segment.duration
    }
  }
  
  if (totalDistance <= 0 || totalTime <= 0) return null
  
  return calculatePace(totalDistance, totalTime)
}

/**
 * Calculate total distance from segments
 */
export function calculateTotalDistance(segments: Array<{duration: number, distance?: number, pace?: string}>): number {
  if (!segments || segments.length === 0) return 0
  
  let totalDistance = 0
  
  for (const segment of segments) {
    let segmentDistance = segment.distance
    
    // If no distance but has pace and duration, calculate distance
    if (!segmentDistance && segment.pace && segment.duration) {
      segmentDistance = calculateDistance(segment.duration, segment.pace)
    }
    
    if (segmentDistance) {
      totalDistance += segmentDistance
    }
  }
  
  return Math.round(totalDistance * 100) / 100
}

/**
 * Calculate total time from segments
 */
export function calculateTotalTime(segments: Array<{duration: number}>): number {
  if (!segments || segments.length === 0) return 0
  
  return segments.reduce((total, segment) => {
    return total + (segment.duration || 0)
  }, 0)
}