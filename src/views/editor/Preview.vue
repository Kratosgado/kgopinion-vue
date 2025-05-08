<script setup lang="ts">
import { post } from '@/stores/extra'
import PostView from '../PostView.vue'

const data = {
  post,
}
</script>

<template>
  <div class="flex w-full flex-col p-4">
    <PostView :data="data" />
  </div>
</template>
