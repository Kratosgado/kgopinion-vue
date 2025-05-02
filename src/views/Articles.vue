<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import PostOverview from '@/components/PostOverview.vue'
import { getRecentPosts } from '@/lib/backend/post.query'
import SEO from '@/lib/seo/SEO.vue'
import type { SEOMetadata } from '@/lib/seo/types'
import type { Post } from '@/lib/utils/types'
import { isLoading } from '@/stores/isLoading'

const metadata: SEOMetadata = {
  title: 'Articles - Kratosgado',
  description: 'Browse all articles on Kratosgado',
  keywords: ['articles', 'posts', 'science', 'programming'],
}

const posts = ref<Post[]>([])
const selectedCategory = ref('all')

// Fetch posts on mount
onBeforeMount(async () => {
  try {
    isLoading.value = true
    const { posts: fetchedPosts } = await getRecentPosts(6, null, true)
    posts.value = fetchedPosts
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

// Get unique categories
const categories = computed(() => [
  'all',
  ...new Set(posts.value.flatMap((post) => post.categories)),
])

// Filter posts by selected category
const filteredPosts = computed(() =>
  selectedCategory.value === 'all'
    ? posts.value
    : posts.value.filter((post) => post.categories.includes(selectedCategory.value)),
)
</script>

<template>
  <SEO :metadata="metadata" />
  <div class="container mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">Articles</h1>

    <!-- Category Filter -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button v-for="category in categories" :key="category" class="btn btn-sm"
          :class="selectedCategory === category ? 'btn-primary' : 'btn-outline'" @click="selectedCategory = category">
          {{ category === 'all' ? 'All Categories' : category }}
        </button>
      </div>
    </div>

    <div v-if="filteredPosts.length === 0" class="text-center py-12">
      <h3 class="text-2xl font-bold mb-4">No articles found</h3>
      <p>There are no articles in this category yet.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PostOverview v-for="post in filteredPosts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>
