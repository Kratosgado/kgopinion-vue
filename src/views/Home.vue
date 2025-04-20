<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PostOverview, Loading } from '@/components' // Adjust path as needed
import { SEO } from '@/lib'
import { getCategoryColor, type Category, type Post, type SEOMetadata } from '@/lib'
import { getAllCategories } from '@/lib/backend/comment.query'
import { getRecentPosts } from '@/lib/backend/post.query'

// Reactive state
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const email = ref('')

// SEO metadata
const metadata: SEOMetadata = {
  title: 'Kratosgado',
  description:
    'Explore programming and science topics in an engaging and informative way. Read challenging thoughts including that will make you question your existence.',
  keywords: ['programming', 'science', 'development', 'software', 'technology'],
  type: 'website',
  ogImage: 'https://Kratosgado.pages.dev/favicon.ico',
  author: 'Kratosgado',
}

// Fetch data on mount
onMounted(async () => {
  try {
    loading.value = true
    const postsData = await getRecentPosts(6, null, false)
    const categoriesData = await getAllCategories()

    posts.value = postsData.posts
    categories.value = categoriesData
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load data'
  } finally {
    loading.value = false
  }
})

// Newsletter subscription handler
const handleSubscribe = () => {
  alert(`Thank you for subscribing with ${email.value}!`)
  email.value = ''
}
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

      <!-- Categories and Newsletter -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Categories -->
        <div class="lg:col-span-1">
          <div class="rounded-box bg-base-100 p-6 shadow-xl">
            <h3 class="mb-6 text-2xl font-bold">Categories</h3>
            <div v-if="loading" class="text-center">Loading categories...</div>
            <div v-else-if="error" class="text-center text-error">{{ error }}</div>
            <div v-else class="space-y-4">
              <div v-for="category in categories" :key="category.name" class="flex items-center justify-between">
                <span class="text-lg">{{ category.name }}</span>
                <span :class="`badge badge-${getCategoryColor(category.postCount)}`">
                  {{ category.postCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="lg:col-span-2">
          <div class="rounded-box bg-base-100 p-8 shadow-xl">
            <h3 class="mb-4 text-2xl font-bold">Subscribe to our Newsletter</h3>
            <p class="mb-6">Get the latest posts and updates delivered straight to your inbox.</p>
            <form @submit.prevent="handleSubscribe" class="flex flex-col gap-4 sm:flex-row">
              <input v-model="email" type="email" placeholder="Enter your email" class="input input-bordered w-full"
                required />
              <button type="submit" class="btn btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
