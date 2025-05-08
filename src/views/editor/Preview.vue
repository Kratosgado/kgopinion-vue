<script setup lang="ts">
import PostView from '../PostView.vue'
import { useEditorStore } from '@/stores/editorStore'
import type { Post } from '@/lib/utils/types'

const store = useEditorStore()
const post: Post = {
  title: store.title,
  excerpt: store.excerpt,
  content: store.content,
  categories: store.categories,
  tags: store.tags,
  slug: store.slug,
  publishedAt: store.publishedAt,
  featuredImage: store.featuredImage,
  readTime: store.readingTime,
  updatedAt: new Date(),
  status: store.status,
  authorId: 'authj',
  commentCount: 0,
  likeCount: 0,
}
</script>

<template>
  <PostView :post />
</template>
