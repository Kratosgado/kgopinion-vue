import { defineStore } from 'pinia'

export type PostStatus = 'draft' | 'published' | 'scheduled'

export interface EditorState {
  title: string
  content: string
  wordCount: number
  excerpt: string
  slug: string
  featuredImage: string
  categories: string[]
  tags: string[]
  status: PostStatus
  publishDate: string
  lastSaved: string | null
  version: number
  history: Array<{
    content: string
    timestamp: string
  }>
  isDirty: boolean
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featuredImage: '',
    categories: [],
    tags: [],
    status: 'draft',
    publishDate: new Date().toISOString(),
    lastSaved: null,
    version: 1,
    wordCount: 0,
    history: [],
    isDirty: false,
  }),
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
      return minutes === 1 ? '1 min read' : `${minutes} min read`
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
    setExcerpt(excerpt: string) {
      this.excerpt = excerpt
      this.isDirty = true
    },
    setFeaturedImage(url: string) {
      this.featuredImage = url
      this.isDirty = true
    },
    addCategory(category: string) {
      if (!this.categories.includes(category)) {
        this.categories.push(category)
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
    setPublishDate(date: string) {
      this.publishDate = date
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
      this.version += 1
      this.isDirty = false

      // Here you would typically save to a backend
      console.log('Content saved', this.title)

      return {
        success: true,
        timestamp: this.lastSaved,
      }
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
      this.publishDate = new Date().toISOString()
      this.lastSaved = null
      this.version = 1
      this.history = []
      this.isDirty = false
    },
  },
})
