import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { PostStatus } from './types'

export async function togglePublish(slug: string, status: PostStatus) {
  try {
    await updateDoc(doc(db, 'posts', slug), {
      status,
    })
    return true
  } catch (err) {
    console.error('Error publishing post', err)
    return false
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
