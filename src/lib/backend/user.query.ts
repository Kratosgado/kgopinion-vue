import { getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getDocRef } from './helpers'
import type { User } from 'firebase/auth'
import type { Author } from '../utils'

export async function getAuthor(id: string) {
  const authorDoc = await getDoc(getDocRef('admins', id))
  if (authorDoc.exists()) {
    return authorDoc.data() as Author
  }
  return undefined
}

export async function addAuthor(user: User) {
  const doc = getDocRef('admins', user.uid)
  const data: Author = {
    id: user.uid,
    name: user.displayName!,
    email: user.email!,
    avatar: user.photoURL!,
    social: {},
    bio: 'Unqualified Programmer',
  }
  await setDoc(doc, { ...data })
}

export async function updateAuthor(data: Partial<Author>) {
  const doc = getDocRef('admins', data.id as string)
  await updateDoc(doc, { ...data })
}
