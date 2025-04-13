import { db } from '@/lib/utils'
import { collection, doc } from 'firebase/firestore'
import type { Collections } from './utils'

export const getCollRef = (name: Collections) => {
  return collection(db, name)
}

export const getDocRef = (name: Collections, id: string) => {
  return doc(db, name, id)
}
