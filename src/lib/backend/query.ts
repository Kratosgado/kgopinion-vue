import type { Author } from '../utils/types'
import { convertValue, parseData, type Collections } from './utils'

export type Direction = 'asc' | 'desc'
type FDirection = 'ASCENDING' | 'DESCENDING'

type Filter<T> = {
  field: keyof T
  op: string
  value: any
}
export class Query<T = any> {
  private readonly apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  private readonly projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID

  private collectionId: Collections
  private filters: Filter<T>[] = []
  private orderBys: { field: keyof T; direction: FDirection }[] = []
  private fields?: { fieldPath: keyof T }[]
  private isOne?: boolean
  private join = false
  private limitValue?: number
  private startCursor?: { values: any[]; before: boolean }
  private endCursor?: { values: any[]; before: boolean }

  constructor(collectionId: Collections) {
    this.collectionId = collectionId
  }

  select(fields: (keyof T)[]) {
    this.fields = fields.map((f) => {
      return { fieldPath: f }
    })
    return this
  }

  postOverView() {
    return this.select([
      'slug',
      'categories',
      'title',
      'readTime',
      'excerpt',
      'featuredImage',
      'authorId',
      'likeCount',
      'commentCount',
      'publishedAt',
    ] as (keyof T)[]).setJoin()
  }
  published() {
    return this.whereEqualTo('status' as any, 'published')
  }

  setJoin() {
    this.join = true
    return this
  }
  one() {
    this.isOne = true
    return this
  }

  orderBy(field: keyof T, direction: Direction = 'desc') {
    const dir: FDirection = direction === 'asc' ? 'ASCENDING' : 'DESCENDING'
    this.orderBys.push({ field, direction: dir })
    return this
  }

  limit(n: number) {
    this.limitValue = n
    return this
  }

  whereEqualTo(field: keyof T, value: any) {
    this.filters.push({ field, op: 'EQUAL', value })
    return this
  }

  whereIncludes(field: keyof T, value: any) {
    this.filters.push({ field, op: 'ARRAY_CONTAINS', value })
    return this
  }

  /** Adds a greater-than filter. */
  whereGreaterThan(field: keyof T, value: any) {
    this.filters.push({ field, op: 'GREATER_THAN', value })
    return this
  }

  /** Adds a greater-than-or-ethisual-to filter. */
  whereGreaterThanOrEthisualTo(field: keyof T, value: any) {
    this.filters.push({ field, op: 'GREATER_THAN_OR_EQUAL', value })
    return this
  }

  /** Adds a less-than filter. */
  whereLessThan(field: keyof T, value: any) {
    this.filters.push({ field, op: 'LESS_THAN', value })
    return this
  }

  /** Adds a less-than-or-ethisual-to filter. */
  whereLessThanOrEqualTo(field: keyof T, value: any) {
    this.filters.push({ field, op: 'LESS_THAN_OR_EQUAL', value })
    return this
  }

  // (Additional where filters such as whereIn, whereArrayContains, etc. can be added similarly.)

  /** Sets a starting boundary (inclusive). */
  startAt(values: any[]) {
    this.startCursor = { values: values.map(convertValue), before: true }
    return this
  }

  /** Sets a starting boundary (exclusive). */
  startAfter(values: any[]) {
    this.startCursor = { values: values.map(convertValue), before: false }
    return this
  }

  /** Sets an ending boundary (inclusive). */
  endAt(values: any[]) {
    this.endCursor = { values: values.map(convertValue), before: false }
    return this
  }

  /** Sets an ending boundary (exclusive). */
  endBefore(values: any[]) {
    this.endCursor = { values: values.map(convertValue), before: true }
    return this
  }

  /** Counts the documents by executing the query and returning the length. */
  async count(): Promise<number> {
    const snapshot = await this.get<T[]>()
    return snapshot.length
  }

  async subscribe(email: string): Promise<boolean> {
    const isValid = email && email.includes('@') && email.includes('.com')

    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/subscribers/${email}?key=${this.apiKey}`
    if (isValid) {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      console.log(res)
      if (!res.ok) {
        return false
      }
      return true
    }
    return false
  }

  /** Execute the query and returns a query snapshop */
  async get<G = T>(): Promise<G> {
    const structuredQuery: any = {
      from: [{ collectionId: this.collectionId }],
    }
    if (this.filters.length > 0) {
      structuredQuery.where = {
        compositeFilter: {
          op: 'AND',
          filters: this.filters.map((f) => ({
            fieldFilter: {
              field: { fieldPath: f.field },
              op: f.op,
              value: convertValue(f.value),
            },
          })),
        },
      }
    }
    if (this.orderBys.length > 0) {
      structuredQuery.orderBy = this.orderBys.map((o) => ({
        field: { fieldPath: o.field },
        direction: o.direction,
      }))
    }
    if (this.fields) {
      structuredQuery.select = {
        fields: this.fields,
      }
    }
    if (this.limitValue !== undefined) {
      structuredQuery.limit = this.limitValue
    }
    if (this.startCursor) {
      structuredQuery.startAt = this.startCursor
    }

    if (this.endCursor) {
      structuredQuery.endAt = this.endCursor
    }

    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:runQuery?key=${this.apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery }),
    })
    if (!res.ok) {
      throw new Error(`Error running query: ${res.status}`)
    }

    const data: any = await res.json()
    // console.log(data);
    if (this.isOne) {
      const parsed = parseData(data[0].document.fields)
      if (this.join) {
        const author = await new Query<Author>('admins')
          .whereEqualTo('id', parsed.authorId)
          .one()
          .get()
        parsed.author = author
      }
      return parsed as G
    }
    let extra: any

    // Extract documents from the response.
    const docs = data.map(async (item: any) => {
      const parsed = parseData(item.document.fields)
      if (!extra && this.join) {
        extra = await new Query<Author>('admins').whereEqualTo('id', parsed.authorId).one().get()
      }
      parsed.author = extra
      return parsed
    })
    return Promise.all(docs) as G
  }
}
