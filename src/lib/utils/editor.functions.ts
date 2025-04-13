import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function togglePublish(id: string, publish: boolean) {
  try {
    await updateDoc(doc(db, 'post', id), {
      published: publish,
    })
    console.log('Post published')
  } catch (err) {
    console.error('Error publishing post', err)
    throw err
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

export function getCategoryColor(count: number): string {
  if (count > 10) return 'primary'
  if (count > 7) return 'secondary'
  if (count > 5) return 'accent'
  if (count > 3) return 'info'
  return 'success'
}
