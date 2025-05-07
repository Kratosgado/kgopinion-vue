import { getPostBySlug } from '@/lib/backend/post.query'
import type { Post, PostStatus } from '@/lib/utils/types'
import { defineStore } from 'pinia'
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

export type EditorState = {
  title: string
  content: string
  wordCount: number
  excerpt: string
  slug: string
  featuredImage: string
  categories: string[]
  tags: string[]
  status: PostStatus
  publishedAt: string
  lastSaved: string | null
  history: Array<{
    content: string
    timestamp: string
  }>
  isDirty: boolean
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => {
    let post: Post | any = {
      title: '',
      content: '',
      readTime: 0,
      excerpt: '',
      slug: '',
      featuredImage: '',
      categories: [],
      tags: [],
      status: 'draft',
      publishedAt: new Date(),
    }
    onBeforeMount(async () => {
      const slug = useRoute().params.slug as string
      if (slug === 'new') return

      post = await getPostBySlug(slug)
    })
    return {
      ...post,
      lastSaved: null,
      isDirty: false,
      wordCount: 0,
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
      this.publishedAt = new Date().toISOString()
      this.lastSaved = null
      this.history = []
      this.isDirty = false
    },
  },
})
