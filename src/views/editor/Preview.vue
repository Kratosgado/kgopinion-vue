<script setup lang="ts">
import PostView from '../PostView.vue'
import { post } from './store'

defineProps<{
  togglePreview: () => void
}>()

const data = {
  post,
}
</script>

<template>
  <div class="flex w-full flex-col p-4">
    <div class="mb-4 flex justify-between">
      <h2 class="text-xl font-bold">Post Preview</h2>
      <button aria-label="exit" class="text-gray-500 hover:text-gray-700" @click="togglePreview">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <PostView :data="data" />
  </div>
</template>
