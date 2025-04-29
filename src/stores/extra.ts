import type { Post } from '@/lib/utils/types'
import { reactive } from 'vue'

export const post: Post = reactive({
  title: 'Untitled Blog',
  content: '',
  slug: '',
  published: false,
  categories: [],
  keywords: [],
  authorId: '',
  commentCount: 0,
  likeCount: 0,
  featuredImage: undefined,
  excerpt: '',
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const extra = reactive({
  linkUrl: '',
  linkText: '',
  showImageModal: false,
  showLinkModal: false,
  showYoutubeModal: false,
  error: '',
  success: '',
  isFeatured: false,
})
