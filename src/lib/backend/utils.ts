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
      result[k] = v.arrayValue.values
        ? v.arrayValue.values.map((obj: any) => {
            if (obj.stringValue) return obj.stringValue
            if (obj.integerValue) return obj.integerValue
            if (obj.booleanValue) return obj.booleanValue
            if (obj.doubleValue) return obj.doubleValue
          })
        : []
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
  if (value instanceof Array) return { arrayValue: { values: value } }
  if (value instanceof Date) return { timestampValue: value.toISOString() }
  return { stringValue: String(value) }
}
