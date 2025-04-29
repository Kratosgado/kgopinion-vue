<script setup lang="ts">
import { ref } from 'vue'
import { savePostOrUpdate } from '@/lib/backend/post.query'
import { extra, post } from '@/stores/extra'
import { togglePublish } from '@/lib/utils/editor.functions'

defineProps<{
  togglePreview: () => void
}>()

const newCategory = ref('')
const newKeyword = ref('')

async function selectImage() {
  extra.showImageModal = true
  extra.isFeatured = true
}

async function savePost() {
  try {
    const res = await savePostOrUpdate(post)
    extra.success = res
    setTimeout(() => {
      extra.success = ''
    }, 5000)
  } catch (err) {
    extra.error = (err as Error).message
    setTimeout(() => {
      extra.error = ''
    }, 5000)
  }
}

function addCategory() {
  if (newCategory.value && !post.categories.includes(newCategory.value)) {
    post.categories = [...post.categories, newCategory.value]
    newCategory.value = ''
  }
}

function removeCategory(category: string) {
  post.categories = post.categories.filter((c) => c !== category)
}

function addKeyword() {
  if (newKeyword.value && !post.keywords.includes(newKeyword.value)) {
    post.keywords = [...post.keywords, newKeyword.value]
    newKeyword.value = ''
  }
}

function removeKeyword(keyword: string) {
  post.keywords = post.keywords.filter((k) => k !== keyword)
}

function handleKeyDown(event: KeyboardEvent, cb: () => void) {
  if (event.key === 'Enter') {
    cb()
  }
}
</script>

<template>
  <div class="space-y-4 rounded-box bg-base-100 p-4 shadow-lg">
    <div class="flex gap-2">
      <button class="btn btn-primary" @click="togglePreview">Preview</button>
      <button class="btn" @click="savePost">Save Draft</button>
      <button class="btn btn-secondary" @click="togglePublish(post.slug!, true)">Publish</button>
    </div>
    <div class="divider"></div>
    <h2 class="text-lg font-bold">Post Details</h2>

    <div class="form-control">
      <label class="label" for="title">
        <span class="label-text">Title</span>
      </label>
      <input v-model="post.title" type="text" id="title" class="input input-bordered" />
      <label class="label" for="excerpt">
        <span class="label-text">Excerpt</span>
      </label>
      <textarea v-model="post.excerpt" id="excerpt" class="textarea textarea-bordered h-24"></textarea>

      <div class="form-control w-full">
        <label for="" class="label">
          <span class="label-text text-lg font-bold">Categories</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div v-for="cat in post.categories" :key="cat" class="badge badge-primary gap-1">
            {{ cat }}
            <button class="btn btn-xs btn-circle" @click="removeCategory(cat)">×</button>
          </div>
        </div>
        <div class="join w-full">
          <input v-model="newCategory" type="text" placeholder="Add a category"
            class="input input-bordered join-item w-full" @keydown="handleKeyDown($event, addCategory)" />
        </div>
      </div>

      <div class="form-control w-full">
        <label for="" class="label">
          <span class="label-text text-lg font-bold">Keywords</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div v-for="key in post.keywords" :key="key" class="badge badge-primary gap-1">
            {{ key }}
            <button class="btn btn-xs btn-circle" @click="removeKeyword(key)">×</button>
          </div>
        </div>
        <div class="join w-full">
          <input v-model="newKeyword" type="text" placeholder="Add a tag" class="input input-bordered join-item w-full"
            @keydown="handleKeyDown($event, addKeyword)" />
        </div>
      </div>

      <label for="image" class="label">
        <span class="label-text">Featured Image</span>
      </label>
      <button class="btn" @click="selectImage">Select Featured Image</button>

      <div v-if="post.featuredImage" class="relative w-full">
        <img :src="post.featuredImage" alt="Post featured preview" class="h-48 w-full rounded-lg object-cover" />
        <button class="btn btn-circle btn-sm absolute right-2 top-2" @click="post.featuredImage = undefined">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
