import { Timestamp } from 'firebase/firestore'
import type { Post } from '../utils/types'

export function parseDate<T = Post>(data: any): T {
  for (const [k, v] of Object.entries<any>(data)) {
    if (v instanceof Timestamp) {
      data[k] = v.toDate()
    }
  }
  return data
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim()
}

export type Collections = 'posts' | 'categories' | 'comments' | 'admins'
