<script setup lang="ts">
import { ref } from 'vue'

const metadata = ref({
  title: '',
  description: '',
  keywords: [],
  ogImage: '',
})
</script>

<template>
  <div class="p-4 bg-base-100 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">SEO Metadata</h2>
    <form class="space-y-4">
      <div class="form-control">
        <label class="label" for="title">
          <span class="label-text">Title</span>
        </label>
        <input v-model="metadata.title" type="text" id="title" class="input input-bordered w-full"
          placeholder="Enter title" />
      </div>
      <div class="form-control">
        <label class="label" for="description">
          <span class="label-text">Description</span>
        </label>
        <textarea v-model="metadata.description" id="description" class="textarea textarea-bordered w-full"
          placeholder="Enter description"></textarea>
      </div>
      <div class="form-control">
        <label class="label" for="keywords">
          <span class="label-text">Keywords (comma-separated)</span>
        </label>
        <input v-model="metadata.keywords" type="text" id="keywords" class="input input-bordered w-full"
          placeholder="Enter keywords" />
      </div>
      <div class="form-control">
        <label class="label" for="ogImage">
          <span class="label-text">Open Graph Image URL</span>
        </label>
        <input v-model="metadata.ogImage" type="text" id="ogImage" class="input input-bordered w-full"
          placeholder="Enter image URL" />
      </div>
    </form>
  </div>
</template>
