<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import { getAllCategories } from '@/lib/backend/comment.query'
import type { SEOMetadata } from '@/lib/seo/types'
import type { Category } from '@/lib/utils/types'
import { getCategoryColor } from '@/lib/utils/editor.functions'

const metadata: SEOMetadata = {
  title: 'Categories - Kratosgado',
  description: 'View all categories of articles posted on Kratosgado',
  keywords: ['Kratosgado', 'blogger', 'categories', 'category'],
}

const categories = ref<Category[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    categories.value = await getAllCategories()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-12 px-4">
    <SEO :metadata="metadata" />

    <h1 class="text-4xl font-bold mb-8">Categories</h1>

    <Loading v-if="loading" />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category.name"
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <div class="card-body">
          <h2 class="card-title text-2xl">{{ category.name }}</h2>
          <div :class="`badge badge-${getCategoryColor(category.postCount)}`">
            {{ category.postCount }} articles
          </div>
          <p v-if="category.description" class="mt-2">{{ category.description }}</p>
          <div class="card-actions justify-end mt-4">
            <router-link :to="`/articles/categories/${category.name.toLowerCase()}`" class="btn btn-primary">View
              Articles</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
