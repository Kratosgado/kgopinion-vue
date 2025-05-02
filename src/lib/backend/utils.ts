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

export function parseData(data: any) {
  const result: any = {}
  for (const [k, v] of Object.entries<any>(data)) {
    if (v.stringValue !== undefined) {
      result[k] = v.stringValue
    } else if (v.integerValue !== undefined) {
      result[k] = parseInt(v.integerValue, 10)
    } else if (v.doubleValue !== undefined) {
      result[k] = v.doubleValue
    } else if (v.booleanValue !== undefined) {
      result[k] = v.booleanValue
    } else if (v.timestampValue !== undefined) {
      result[k] = new Date(v.timestampValue)
    } else if (v.arrayValue !== undefined) {
      result[k] = v.arrayValue.values ? v.arrayValue.values.map(parseData(v.mapValue.fields)) : []
    } else if (v.mapValue !== undefined) {
      result[k] = parseData(v.mapValue.fields)
    } else if (v.nullValue !== undefined) {
      result[k] = null
    } else {
      console.warn(`Unsupported Firestore value type for key "${k}"`)
    }
  }
  return result
}

// Helper: Convert a JS value to Firestore REST API field format.
// (Extend this as needed for other types.)
export function convertValue(value: any): any {
  if (typeof value === 'string') return { stringValue: value }
  if (typeof value === 'number') return { integerValue: value }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (value instanceof Date) return { timestampValue: value.toISOString() }
  return { stringValue: String(value) }
}
