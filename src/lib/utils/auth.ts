// src/lib/auth.ts
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from './firebase'
import { getAuthor, type Author } from '..'

export function subscribeToAuthState(callback: (user: Author | undefined) => void) {
  return onAuthStateChanged(firebaseAuth, async (u) => {
    const user = u ? await getAuthor(u!.uid) : undefined
    console.log(user)
    callback(user)
  })
}

export function toAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback)
}
