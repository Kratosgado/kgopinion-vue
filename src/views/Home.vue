<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loading from '@/components/Loading.vue' // Adjust path as needed
import PostOverview from '@/components/PostOverview.vue'
import SEO from '@/lib/seo/SEO.vue'
import { type SEOMetadata } from '@/lib/seo/types'
import { getRecentPosts } from '@/lib/backend/post.query'
import type { Post } from '@/lib/utils/types'

// Reactive state
const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// SEO metadata
const metadata: SEOMetadata = {
  title: 'Kratosgado',
  description:
    'Explore programming and science topics in an engaging and informative way. Read challenging thoughts including that will make you question your existence.',
  keywords: ['programming', 'science', 'development', 'software', 'technology'],
  type: 'website',
  canonicalUrl: 'https://Kratosgado.pages.dev',
  publishedTime: '2023',
  author: 'Kratosgado',
}

// Fetch data on mount
onMounted(async () => {
  try {
    loading.value = true
    const postsData = await getRecentPosts(6, null, false)

    posts.value = postsData.posts
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load data'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <!-- SEO Component -->
    <SEO :metadata="metadata" />

    <!-- Hero Section -->
    <div class="hero min-h-[35vh] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-4xl font-bold">I Have An Idea🤔</h1>
          <p class="py-6">
            Discover insightful articles on web development, design, and technology. Stay updated
            with the latest trends and best practices.
          </p>
          <router-link to="/" class="btn btn-primary">Get Started</router-link>
        </div>
      </div>
    </div>

    <main class="container mx-auto flex-grow px-4 py-10">
      <!-- Featured Posts -->
      <section class="mb-16">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-3xl font-bold">Featured Posts</h2>
          <router-link to="/" class="btn btn-outline btn-sm">View All</router-link>
        </div>

        <Loading v-if="loading" />
        <div v-else-if="error" class="text-center text-error">{{ error }}</div>
        <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <PostOverview v-for="post in posts" :key="post.slug" :post="post" />
        </div>
      </section>
    </main>
  </div>
</template>
