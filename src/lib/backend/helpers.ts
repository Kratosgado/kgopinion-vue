import { collection, doc } from 'firebase/firestore'
import type { Collections } from './utils'
import { db } from '../utils/firebase'

export const getCollRef = (name: Collections) => {
  return collection(db, name)
}

export const getDocRef = (name: Collections, id: string) => {
  return doc(db, name, id)
}
