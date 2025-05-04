<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEditorStore } from '../../stores/editorStore'
import { useSeoStore } from '@/stores/seoStore'
import { useEditor } from '@/components/editor/useEditor'

const editorStore = useEditorStore()
const seoStore = useSeoStore()
const { editor, insertTemplate: insertEditorTemplate } = useEditor()

// Form fields
const status = ref(editorStore.status)
const publishDate = ref(editorStore.publishDate)
const slug = ref(editorStore.slug)
const featuredImage = ref(editorStore.featuredImage)
const excerpt = ref(editorStore.excerpt)
const categories = ref([...editorStore.categories])
const tags = ref([...editorStore.tags])
const newCategory = ref('')
const newTag = ref('')

// Update methods
const updateStatus = () => {
  editorStore.setStatus(status.value as 'draft' | 'published' | 'scheduled')
}

const updatePublishDate = () => {
  editorStore.setPublishDate(publishDate.value)
}

const updateSlug = () => {
  editorStore.setSlug(slug.value)
}

const updateExcerpt = () => {
  editorStore.setExcerpt(excerpt.value)
}

const selectFeaturedImage = () => {
  // In a real app, you would use a media library component
  const url = prompt('Enter image URL')
  if (url) {
    editorStore.setFeaturedImage(url)
    featuredImage.value = url
  }
}

const removeFeaturedImage = () => {
  editorStore.setFeaturedImage('')
  featuredImage.value = ''
}

const addCategory = () => {
  if (newCategory.value.trim()) {
    editorStore.addCategory(newCategory.value.trim())
    categories.value = [...editorStore.categories]
    newCategory.value = ''
  }
}

const removeCategory = (category: string) => {
  editorStore.removeCategory(category)
  categories.value = [...editorStore.categories]
}

const addTag = () => {
  if (newTag.value.trim()) {
    editorStore.addTag(newTag.value.trim())
    tags.value = [...editorStore.tags]
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  editorStore.removeTag(tag)
  tags.value = [...editorStore.tags]
}

// Templates
const insertTemplate = (templateType: string) => {
  let template = ''

  switch (templateType) {
    case 'cta':
      template = `
        <div class="cta-container p-6 bg-primary text-white rounded-lg text-center my-6">
          <h3 class="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p class="mb-4">Join thousands of satisfied customers today!</p>
          <a href="#" class="btn bg-white text-primary hover:bg-gray-100">Sign Up Now</a>
        </div>
      `
      break
    case 'testimonial':
      template = `
        <div class="testimonial-container p-6 bg-gray-50 border border-gray-200 rounded-lg my-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
            <div>
              <h4 class="font-bold">Customer Name</h4>
              <p class="text-sm text-gray-600">Position, Company</p>
            </div>
          </div>
          <p class="italic">"This product has completely transformed our workflow. We've seen a 50% increase in productivity since implementation."</p>
        </div>
      `
      break
    case 'productFeature':
      template = `
        <div class="feature-container my-6">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 p-4">
              <div class="bg-gray-300 rounded-lg h-64 flex items-center justify-center">
                <span class="text-gray-600">Feature Image</span>
              </div>
            </div>
            <div class="md:w-1/2 p-4">
              <h3 class="text-2xl font-bold mb-3">Feature Title</h3>
              <p class="mb-4">Detailed description of the feature and how it benefits the user.</p>
              <ul class="list-disc pl-5 mb-4">
                <li>Benefit one</li>
                <li>Benefit two</li>
                <li>Benefit three</li>
              </ul>
              <a href="#" class="text-primary font-bold">Learn more →</a>
            </div>
          </div>
        </div>
      `
      break
    case 'faq':
      template = `
        <div class="faq-container my-6">
          <h3 class="text-2xl font-bold mb-4">Frequently Asked Questions</h3>

          <div class="space-y-4">
            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                Question 1?
              </div>
              <div class="collapse-content">
                <p>Answer to question 1. Provide detailed information here.</p>
              </div>
            </div>

            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                Question 2?
              </div>
              <div class="collapse-content">
                <p>Answer to question 2. Provide detailed information here.</p>
              </div>
            </div>

            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                Question 3?
              </div>
              <div class="collapse-content">
                <p>Answer to question 3. Provide detailed information here.</p>
              </div>
            </div>
          </div>
        </div>
      `
      break
    case 'pricing':
      template = `
        <div class="pricing-container my-6">
          <h3 class="text-2xl font-bold mb-4 text-center">Pricing Options</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="pricing-card border border-gray-200 rounded-lg p-6 flex flex-col">
              <h4 class="text-xl font-bold mb-2">Basic</h4>
              <div class="text-3xl font-bold mb-2">$19<span class="text-sm font-normal">/month</span></div>
              <p class="text-gray-600 mb-4">Perfect for small businesses</p>
              <ul class="mb-6 flex-1">
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Feature one</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Feature two</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Feature three</span>
                </li>
              </ul>
              <button class="btn btn-outline w-full">Get Started</button>
            </div>
            <div class="pricing-card border border-primary rounded-lg p-6 flex flex-col">
              <div class="badge badge-primary mb-2">Popular</div>
              <h4 class="text-xl font-bold mb-2">Professional</h4>
              <div class="text-3xl font-bold mb-2">$49<span class="text-sm font-normal">/month</span></div>
              <p class="text-gray-600 mb-4">For growing businesses</p>
              <ul class="mb-6 flex-1">
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>All Basic features</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Pro feature one</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Pro feature two</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Pro feature three</span>
                </li>
              </ul>
              <button class="btn btn-primary w-full">Get Started</button>
            </div>
            <div class="pricing-card border border-gray-200 rounded-lg p-6 flex flex-col">
              <h4 class="text-xl font-bold mb-2">Enterprise</h4>
              <div class="text-3xl font-bold mb-2">$99<span class="text-sm font-normal">/month</span></div>
              <p class="text-gray-600 mb-4">For large organizations</p>
              <ul class="mb-6 flex-1">
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>All Pro features</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Enterprise feature one</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Enterprise feature two</span>
                </li>
                <li class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  <span>Priority support</span>
                </li>
              </ul>
              <button class="btn btn-outline w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      `
      break
    default:
      template = ''
  }

  if (template && editor) {
    insertEditorTemplate(template)
  }
}

// Revisions
const viewRevisions = () => {
  // In a real app, this would open a modal with revision history
  alert('Revision history feature would open here')
}

// Update references when store changes
editorStore.$subscribe((mutation, state) => {
  if (mutation.type.includes('set')) {
    status.value = state.status
    publishDate.value = state.publishDate
    slug.value = state.slug
    featuredImage.value = state.featuredImage
    excerpt.value = state.excerpt
    categories.value = [...state.categories]
    tags.value = [...state.tags]
  }
})
</script>
<template>
  <div class="editor-sidebar w-64 bg-white border-r border-gray-200 overflow-y-auto h-full">
    <div class="p-4">
      <!-- Blog Post Settings -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Post Settings</h3>

        <!-- Status -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="status"
            @change="updateStatus"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <!-- Publish Date (show if scheduled) -->
        <div class="mb-4" v-if="status === 'scheduled'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
          <input
            type="datetime-local"
            v-model="publishDate"
            @change="updatePublishDate"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <!-- Slug -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            v-model="slug"
            @input="updateSlug"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <!-- Featured Image -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
          <div v-if="featuredImage" class="mb-2">
            <img :src="featuredImage" class="w-full h-auto rounded-md" alt="Featured Image" />
            <button @click="removeFeaturedImage" class="text-red-500 text-sm mt-1">Remove</button>
          </div>
          <button @click="selectFeaturedImage" class="btn btn-sm btn-outline w-full">
            {{ featuredImage ? 'Change Image' : 'Add Image' }}
          </button>
        </div>

        <!-- Excerpt -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            v-model="excerpt"
            @input="updateExcerpt"
            class="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="Brief summary of your post"
          ></textarea>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Categories</h3>
        <div class="mb-2 flex">
          <input
            type="text"
            v-model="newCategory"
            @keyup.enter="addCategory"
            class="flex-1 p-2 border border-gray-300 rounded-l-md"
            placeholder="Add category"
          />
          <button @click="addCategory" class="p-2 bg-primary text-white rounded-r-md">Add</button>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="category in categories"
            :key="category"
            class="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-md flex items-center"
          >
            {{ category }}
            <button @click="removeCategory(category)" class="ml-1 text-gray-500 hover:text-red-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Tags</h3>
        <div class="mb-2 flex">
          <input
            type="text"
            v-model="newTag"
            @keyup.enter="addTag"
            class="flex-1 p-2 border border-gray-300 rounded-l-md"
            placeholder="Add tag"
          />
          <button @click="addTag" class="p-2 bg-primary text-white rounded-r-md">Add</button>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="tag in tags"
            :key="tag"
            class="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md flex items-center"
          >
            {{ tag }}
            <button @click="removeTag(tag)" class="ml-1 text-gray-500 hover:text-red-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Templates -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Templates</h3>
        <div class="space-y-2">
          <button
            @click="insertTemplate('cta')"
            class="w-full p-2 text-left border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Call to Action
          </button>
          <button
            @click="insertTemplate('testimonial')"
            class="w-full p-2 text-left border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Testimonial
          </button>
          <button
            @click="insertTemplate('productFeature')"
            class="w-full p-2 text-left border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Product Feature
          </button>
          <button
            @click="insertTemplate('faq')"
            class="w-full p-2 text-left border border-gray-300 rounded-md hover:bg-gray-50"
          >
            FAQ Section
          </button>
          <button
            @click="insertTemplate('pricing')"
            class="w-full p-2 text-left border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Pricing Table
          </button>
        </div>
      </div>

      <!-- SEO & Readability -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">SEO & Readability</h3>
        <div class="space-y-2">
          <div class="p-2 border border-gray-200 rounded-md">
            <div class="flex justify-between items-center">
              <span class="font-medium">Readability</span>
              <div class="flex items-center">
                <div
                  class="w-2 h-2 rounded-full mr-1"
                  :class="{
                    'bg-red-500': seoStore.readabilityScore < 40,
                    'bg-yellow-500':
                      seoStore.readabilityScore >= 40 && seoStore.readabilityScore < 70,
                    'bg-green-500': seoStore.readabilityScore >= 70,
                  }"
                ></div>
                <span>{{ seoStore.readabilityScore }}</span>
              </div>
            </div>
          </div>
          <div class="p-2 border border-gray-200 rounded-md">
            <div class="flex justify-between items-center">
              <span class="font-medium">SEO Score</span>
              <div class="flex items-center">
                <div
                  class="w-2 h-2 rounded-full mr-1"
                  :class="{
                    'bg-red-500': seoStore.seoScore < 40,
                    'bg-yellow-500': seoStore.seoScore >= 40 && seoStore.seoScore < 70,
                    'bg-green-500': seoStore.seoScore >= 70,
                  }"
                ></div>
                <span>{{ seoStore.seoScore }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Word Count Stats -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Stats</h3>
        <div class="grid grid-cols-2 gap-2">
          <div class="p-2 bg-gray-50 rounded-md">
            <div class="text-sm text-gray-600">Words</div>
            <div class="text-xl font-bold">{{ editorStore.wordCount }}</div>
          </div>
          <div class="p-2 bg-gray-50 rounded-md">
            <div class="text-sm text-gray-600">Reading time</div>
            <div class="text-xl font-bold">{{ editorStore.readingTime }}</div>
          </div>
        </div>
      </div>

      <!-- Revision History -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Revisions</h3>
        <div class="space-y-2">
          <button @click="viewRevisions" class="btn btn-sm btn-outline w-full">
            View Revision History
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
