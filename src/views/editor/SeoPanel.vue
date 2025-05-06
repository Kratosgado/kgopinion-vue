<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSeoStore } from '../../stores/seoStore'
import { useEditorStore } from '../../stores/editorStore'
import AlertError from '@/components/AlertError.vue'
import AlertSuccess from '@/components/AlertSuccess.vue'
import Progress from '@/components/Progress.vue'

const seoStore = useSeoStore()
const editorStore = useEditorStore()

const metaTitle = ref(seoStore.metaTitle)
const metaDescription = ref(seoStore.metaDescription)
const focusKeyword = ref(seoStore.focusKeyword)
const activeTab = ref('facebook')

const openGraph = ref({
  title: seoStore.openGraph.title,
  description: seoStore.openGraph.description,
  image: seoStore.openGraph.image,
})

const twitter = ref({
  title: seoStore.twitter.title,
  description: seoStore.twitter.description,
  image: seoStore.twitter.image,
})

// Computed properties for styling
const metaTitleLengthClass = computed(() => {
  const length = seoStore.analysis.titleLength
  if (length === 0) return 'text-gray-500'
  if (length < 30 || length > 60) return 'text-red-500'
  return 'text-green-500'
})

const metaDescriptionLengthClass = computed(() => {
  const length = seoStore.analysis.descriptionLength
  if (length === 0) return 'text-gray-500'
  if (length < 120 || length > 155) return 'text-red-500'
  return 'text-green-500'
})

const previewUrl = computed(() => {
  const baseUrl = 'kratosgado.pages.dev/articles/'
  const slug = editorStore.slug || 'sample-post'
  return baseUrl + slug
})

// Helper functions for styling
const scoreClass = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

// Update functions
const updateMetaTitle = () => {
  seoStore.updateMetaTitle(metaTitle.value)
}

const updateMetaDescription = () => {
  seoStore.updateMetaDescription(metaDescription.value)
}

const updateFocusKeyword = () => {
  seoStore.updateFocusKeyword(focusKeyword.value)
}

const updateOpenGraph = (field: keyof typeof openGraph.value, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  openGraph.value[field] = value
  seoStore.updateOpenGraph({ [field]: value })
}

const updateTwitter = (field: keyof typeof twitter.value, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  twitter.value[field] = value
  seoStore.updateTwitter({ [field]: value })
}

// Watch for changes from the store
watch(
  () => seoStore.metaTitle,
  (newValue) => {
    metaTitle.value = newValue
  },
)

watch(
  () => seoStore.metaDescription,
  (newValue) => {
    metaDescription.value = newValue
  },
)

watch(
  () => seoStore.focusKeyword,
  (newValue) => {
    focusKeyword.value = newValue
  },
)

watch(
  () => seoStore.openGraph,
  (newValue) => {
    openGraph.value = { ...newValue }
  },
  { deep: true },
)

watch(
  () => seoStore.twitter,
  (newValue) => {
    twitter.value = { ...newValue }
  },
  { deep: true },
)
</script>

<template>
  <div class="seo-panel w-80 bg-base border-l border-gray-500 overflow-y-auto h-full flex flex-col">
    <div class="p-4 border-b border-gray-500">
      <h2 class="text-xl font-bold">SEO</h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <!-- SEO Score -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <span class="font-medium">SEO Score</span>
            <span :class="scoreClass(seoStore.seoScore)">{{ seoStore.seoScore }}/100</span>
          </div>
          <Progress :value="seoStore.seoScore" />
        </div>

        <!-- Readability Score -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <span class="font-medium">Readability</span>
            <span :class="scoreClass(seoStore.readabilityScore)">{{ seoStore.readabilityScore }}/100</span>
          </div>
          <Progress :value="seoStore.readabilityScore" />
        </div>

        <!-- Focus Keyword -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-1">Focus Keyword</label>
          <input type="text" v-model="focusKeyword" @input="updateFocusKeyword" class="input input-info p-2 rounded-md"
            placeholder="Enter focus keyword" />
        </div>

        <!-- Meta Title -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-1">
            Meta Title
            <span :class="metaTitleLengthClass">{{ seoStore.analysis.titleLength }}/60</span>
          </label>
          <input type="text" v-model="metaTitle" @input="updateMetaTitle" class="input input-info"
            placeholder="Enter meta title" />
        </div>

        <!-- Meta Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-1">
            Meta Description
            <span :class="metaDescriptionLengthClass">{{ seoStore.analysis.descriptionLength }}/155</span>
          </label>
          <textarea v-model="metaDescription" @input="updateMetaDescription" class="textarea textarea-info" rows="3"
            placeholder="Enter meta description"></textarea>
        </div>

        <!-- SEO Preview -->
        <div class="mb-6 p-3 border border-gray-500 rounded-md">
          <h3 class="text-sm font-medium mb-2">Google Preview</h3>
          <div class="google-preview">
            <div class="text-blue-600 text-lg truncate">{{ metaTitle || 'Title Example' }}</div>
            <div class="text-green-700 text-sm">{{ previewUrl }}</div>
            <div class="text-gray-400 text-sm line-clamp-2">
              {{
                metaDescription ||
                'This is an example of how your page might appear in Google search results.' +
                'Write a compelling meta description to improve click - through rates.'
              }}
            </div>
          </div>
        </div>

        <!-- SEO Analysis -->
        <div class="mb-6">
          <h3 class="text-sm font-medium mb-2">SEO Analysis</h3>

          <div v-if="seoStore.analysis.improvements.length > 0">
            <AlertError v-for="(improvement, index) in seoStore.analysis.improvements" :key="index" :msg="improvement"
              class="alert-soft" />
          </div>
          <AlertSuccess v-else class="alert-soft" msg="Great job! No SEO improvements needed" />
        </div>

        <!-- Social Media Preview Tabs -->
        <div class="mb-6">
          <div role="tablist" class="tabs tabs-border mb-2">
            <a class="tab" :class="{ 'tab-active': activeTab === 'facebook' }"
              @click="activeTab = 'facebook'">Facebook</a>
            <a class="tab" :class="{ 'tab-active': activeTab === 'twitter' }" @click="activeTab = 'twitter'">Twitter</a>
          </div>

          <div v-show="activeTab === 'facebook'" class="p-3 border border-gray-500 rounded-md">
            <label class="block text-sm font-medium text-gray-400 mb-1">OG Title</label>
            <input type="text" v-model="openGraph.title" @input="updateOpenGraph('title', $event)"
              class="input input-info" />

            <label class="block text-sm font-medium text-gray-400 mb-1">OG Description</label>
            <textarea v-model="openGraph.description" @input="updateOpenGraph('description', $event)"
              class="textarea textarea-info" rows="2"></textarea>

            <label class="block text-sm font-medium text-gray-400 mb-1">OG Image</label>
            <input type="text" v-model="openGraph.image" @input="updateOpenGraph('image', $event)"
              class="input input-info" placeholder="Image URL" />
          </div>

          <div v-show="activeTab === 'twitter'" class="p-3 border border-gray-500 rounded-md">
            <label class="block text-sm font-medium text-gray-400 mb-1">Twitter Title</label>
            <input type="text" v-model="twitter.title" @input="updateTwitter('title', $event)"
              class="input input-info" />

            <label class="block text-sm font-medium text-gray-400 mb-1">Twitter Description</label>
            <textarea v-model="twitter.description" @input="updateTwitter('description', $event)"
              class="textarea textarea-info" rows="2"></textarea>

            <label class="block text-sm font-medium text-gray-400 mb-1">Twitter Image</label>
            <input type="text" v-model="twitter.image" @input="updateTwitter('image', $event)" class="input input-info"
              placeholder="Image URL" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
