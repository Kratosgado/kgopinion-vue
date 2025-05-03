<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import Editor from './Editor.vue'
import Details from './Details.vue'
import Preview from './Preview.vue'
import { getPostBySlug } from '@/lib/backend/post.query'
import { useRoute } from 'vue-router'
import { post } from '@/stores/extra'

const showPreview = ref(false)

onBeforeMount(async () => {
  const route = useRoute()

  const slug = route.params.slug
  if (slug != 'new') {
    const edit = (await getPostBySlug(route.params.slug as string))!
    post.slug = edit.slug
    post.title = edit.slug
    post.authorId = edit.authorId
    post.author = edit.author
    post.content = edit.content
    post.createdAt = edit.createdAt
    post.published = edit.published
    post.publishedAt = edit.publishedAt
    post.updatedAt = edit.updatedAt
    post.excerpt = edit.excerpt
    post.keywords = edit.keywords
    post.categories = edit.categories
    post.featuredImage = edit.featuredImage
    post.relatedPosts = edit.relatedPosts || []
    post.readTime = edit.readTime || 0
    post.likeCount = edit.likeCount || 0
    post.commentCount = edit.commentCount || 0
  }
})
</script>

<template>
  <div class="min-h-screen bg-base-300 p-4">
    <!-- TODO: add status  -->
    <div class="flex flex-row justify-center gap-4">
      <template v-if="showPreview">
        <Preview :togglePreview="() => (showPreview = !showPreview)" />
      </template>
      <template v-else>
        <div>
          <Editor />
        </div>
        <Details :toggle-preview="() => (showPreview = !showPreview)" />
      </template>
    </div>
  </div>
</template>
