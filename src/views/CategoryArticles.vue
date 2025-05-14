<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import PostOverview from '@/components/PostOverview.vue'
import SEO from '@/lib/seo/SEO.vue'
import type { SEOMetadata } from '@/lib/seo/types'
import type { Post } from '@/lib/utils/types'
import { isLoading } from '@/stores/isLoading'
import { Query } from '@/lib/backend/query'
import { useRoute } from 'vue-router'

const metadata: SEOMetadata = {
  title: 'Articles - Kratosgado',
  description: 'Browse all articles on Kratosgado',
  keywords: ['articles', 'posts', 'science', 'programming'],
  type: 'website',
  canonicalUrl: 'https://Kratosgado.pages.dev/articles',
  publishedTime: '2023',
  author: 'Kratosgado',
}

const posts = ref<Post[]>([])
const slug = useRoute().params.slug

// Fetch posts on mount
onBeforeMount(async () => {
  try {
    isLoading.value = true

    posts.value = await new Query<Post>('posts')
      .whereEqualTo('status', 'published')
      .whereIncludes('categories', slug)
      .limit(10)
      .postOverView()
      .get<Post[]>()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-12 px-4">
    <SEO :metadata="metadata" />
    <h1 class="text-4xl font-bold mb-8">{{ slug }}</h1>

    <div v-if="posts.length === 0" class="text-center py-12">
      <h3 class="text-2xl font-bold mb-4">No articles found</h3>
      <p>There are no articles in this category yet.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PostOverview v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>
