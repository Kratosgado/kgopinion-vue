import type { Editor, Range } from '@tiptap/vue-3'

export type Author = {
  id: string
  name: string
  email: string
  bio?: string
  avatar: string
  social?: {
    twitter?: string
    github?: string
    linkedIn?: string
  }
}

export type HeadingItem = {
  id: string
  level: number
  text: string
}

export type ImageType = {
  id: string
  src: string
  alt: string
  thumbnail: string
  fileName: string
  storagePath: string
}

export type PostStatus = 'draft' | 'published' | 'scheduled'
export type Post = {
  title: string
  content: string
  slug: string
  excerpt: string
  publishedAt?: Date
  lastModified?: string
  imageCaption?: string
  isNews?: boolean
  updatedAt: Date
  authorId: string
  author?: Author
  categories: string[]
  tags: string[]
  status: PostStatus
  featuredImage?: string
  readTime?: number
  likeCount: number
  commentCount: number
  relatedPosts?: string[]
}

// Comment type
export type Comment = {
  id: string // Firestore document ID
  postId: string // Reference to post
  authorName: string // Denormalized author name
  authorAvatar?: string // Denormalized author avatar
  content: string // Comment text
  createdAt: Date // When comment was created
  updatedAt: Date // When comment was last edited
  parentId?: string // For nested comments (replies)
  likes: number // Like count
}

export type Category = {
  name: string // Display name
  description?: string // Category description
  postCount: number // Number of posts in category
}

export type TiptapCommandType = {
  editor: Editor
  range: Range
  props: any
}
