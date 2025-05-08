<script setup lang="ts">
import type { Post } from '@/lib/utils/types'

const { content, excerpt } = defineProps<{ content: string; excerpt: string }>()
</script>

<template>
  <article class="prose prose-lg max-w-none items-center">
    <p v-if="excerpt" class="lead text-xl font-medium italic">{{ excerpt }}</p>
    <hr v-if="excerpt" class="my-6" />
    <div v-html="content"></div>
  </article>
</template>
