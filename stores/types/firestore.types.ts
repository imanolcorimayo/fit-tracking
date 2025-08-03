import type { Timestamp } from 'firebase/firestore'

export interface BaseDocument {
  id: string
  userUid: string
  createdAt: Timestamp
  updatedAt: Timestamp
}