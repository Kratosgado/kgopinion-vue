import { getPostBySlug } from '@/lib/backend/post.query'
import type {  PostStatus } from '@/lib/utils/types'
import { defineStore } from 'pinia'

export type EditorState = {
  title: string
  content: string
  wordCount: number
  excerpt: string
  slug: string
  featuredImage: string | undefined
  categories: string[]
  tags: string[]
  status: PostStatus
  publishedAt: Date | undefined
  lastSaved: string | null
  history: Array<{
    content: string
    timestamp: string
  }>
  isDirty: boolean
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => {
    return {
      title: '',
      content: '',
      wordCount: 0,
      excerpt: '',
      slug: '',
      featuredImage: '',
      categories: [],
      tags: [],
      status: 'draft',
      publishedAt: new Date(),
      lastSaved: null,
      isDirty: false,
      history: [],
    }
  },
  getters: {
    wordCount: (state) => {
      if (!state.content) return 0
      // Remove HTML tags and count words
      const text = state.content.replace(/<\/?[^>]+(>|$)/g, ' ')
      return text.split(/\s+/).filter((word) => word.length > 0).length
    },
    readingTime: (state) => {
      // Average reading speed: 200 words per minute
      const minutes = Math.ceil(state.wordCount / 200)
      return minutes
    },
  },
  actions: {
    setTitle(title: string) {
      this.title = title
      this.isDirty = true
      this.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    },
    setContent(content: string) {
      this.content = content
      this.isDirty = true
    },
    setFeaturedImage(url: string) {
      this.featuredImage = url
      this.isDirty = true
    },
    addCategory(cat: string) {
      if (!this.categories.includes(cat)) {
        this.categories.push(cat)
        this.isDirty = true
      }
    },
    removeCategory(category: string) {
      this.categories = this.categories.filter((c) => c !== category)
      this.isDirty = true
    },
    addTag(tag: string) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
        this.isDirty = true
      }
    },
    removeTag(tag: string) {
      this.tags = this.tags.filter((t) => t !== tag)
      this.isDirty = true
    },
    setStatus(status: 'draft' | 'published' | 'scheduled') {
      this.status = status
      this.isDirty = true
    },
    setPublishDate(date: Date) {
      this.publishedAt = date
      this.isDirty = true
    },
    saveContent(status: PostStatus) {
      // Create a snapshot for history
      if (this.content) {
        this.history.push({
          content: this.content,
          timestamp: new Date().toISOString(),
        })

        // Keep only the last 10 versions
        if (this.history.length > 10) {
          this.history.shift()
        }
      }

      this.lastSaved = new Date().toISOString()
      this.isDirty = false

      // TODO: save to backend

      return {
        success: true,
        timestamp: this.lastSaved,
      }
    },
    async loadPost(slug: string) {
      const edit = (await getPostBySlug(slug))!
      this.slug = edit.slug
      this.title = edit.title
      this.content = edit.content
      this.publishedAt = edit.publishedAt
      this.status = edit.status
      this.excerpt = edit.excerpt
      this.tags = edit.tags || []
      this.categories = edit.categories
      this.featuredImage = edit.featuredImage
    },
    restoreVersion(index: number) {
      if (index >= 0 && index < this.history.length) {
        this.content = this.history[index].content
        return true
      }
      return false
    },
    resetEditor() {
      this.title = ''
      this.content = ''
      this.excerpt = ''
      this.slug = ''
      this.featuredImage = ''
      this.categories = []
      this.tags = []
      this.status = 'draft'
      this.publishedAt = new Date()
      this.lastSaved = null
      this.history = []
      this.isDirty = false
    },
  },
})
