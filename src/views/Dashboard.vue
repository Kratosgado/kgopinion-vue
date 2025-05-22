<script setup lang="ts">
import { getPostsByAuthor } from '@/lib/backend/post.query'
import type { Post, PostStatus } from '@/lib/utils/types'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const posts = ref<Post[]>([])
const isLoading = ref(true)
const activeTab = ref<PostStatus | undefined>('published')
const searchQuery = ref('')

// Computed properties
const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    // Filter by tab
    if (activeTab.value === 'published' && !(post.status === 'published')) return false
    if (activeTab.value === 'draft' && post.status === 'published') return false

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.categories.some((cat) => cat.toLowerCase().includes(query))
      )
    }

    return true
  })
})

const publishedCount = computed(
  () => posts.value.filter((post) => post.status === 'published').length,
)
const draftCount = computed(() => posts.value.filter((p) => p.status === 'draft').length)
const scheduledCount = computed(() => posts.value.filter((p) => p.status === 'scheduled').length)

// Fetch posts
onMounted(async () => {
  try {
    isLoading.value = true
    posts.value = await getPostsByAuthor(undefined, false, undefined)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

const createNewPost = () => {
  router.push('/auth/editor/new')
}

const editPost = (slug: string) => {
  router.push(`/auth/editor/${slug}`)
}

const viewPost = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const togglePublishStatus = async (post: Post) => {
  // post.published = !post.published
  // if (post.published) {
  //   post.publishedAt = new Date()
  // } else {
  //   post.publishedAt = undefined
  // }
  posts.value = [...posts.value]
}

const deletePost = async (postToDelete: Post) => {
  if (
    !confirm(
      `Are you sure you want to delete "${postToDelete.title}"? This action cannot be undone.`,
    )
  ) {
    return
  }
  posts.value = posts.value.filter((post) => post.slug !== postToDelete.slug)
}
</script>

<template>
  <div class="container mx-auto py-12 px-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h1 class="text-4xl font-bold">Author Dashboard</h1>
      <button class="btn btn-primary" @click="createNewPost">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create New Post
      </button>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="tabs tabs-boxed">
        <button class="tab" :class="{ 'tab-active': activeTab === 'published' }" @click="activeTab = 'published'">
          Published ({{ publishedCount }})
        </button>
        <button class="tab" :class="{ 'tab-active': activeTab === 'draft' }" @click="activeTab = 'draft'">
          Drafts ({{ draftCount }})
        </button>
        <button class="tab" :class="{ 'tab-active': activeTab === 'scheduled' }" @click="activeTab = 'scheduled'">
          Scheduled ({{ scheduledCount }})
        </button>
        <button class="tab" :class="{ 'tab-active': activeTab === undefined }" @click="activeTab = undefined">
          All Posts ({{ posts.length }})
        </button>
      </div>
      <div class="form-control w-full md:w-auto">
        <div class="input-group">
          <input v-model="searchQuery" type="text" placeholder="Search posts..." class="input input-bordered" />
          <button aria-label="search" class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div v-else-if="filteredPosts.length === 0" class="card bg-base-100 shadow-xl">
      <div class="card-body text-center py-16">
        <h2 class="text-2xl font-bold mb-2">No posts found</h2>
        <p v-if="searchQuery">No posts match your search criteria. Try a different search term.</p>
        <template v-else-if="activeTab === 'published'">
          <p>You don't have any published posts yet.</p>
          <button class="btn btn-primary mt-4 mx-auto" @click="createNewPost">
            Create Your First Post
          </button>
        </template>
        <template v-else-if="activeTab === 'draft'">
          <p>You don't have any drafts.</p>
          <button class="btn btn-primary mt-4 mx-auto" @click="createNewPost">
            Create New Post
          </button>
        </template>
        <template v-else>
          <p>You don't have any posts yet.</p>
          <button class="btn btn-primary mt-4 mx-auto" @click="createNewPost">
            Create Your First Post
          </button>
        </template>
      </div>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th class="hidden md:table-cell">Date</th>
            <th class="hidden md:table-cell">Categories</th>
            <th class="hidden md:table-cell">Stats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in filteredPosts" :key="post.slug">
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img :src="post.featuredImage || '/placeholder.svg'" :alt="post.title" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ post.title }}</div>
                  <div class="text-sm opacity-50 truncate max-w-xs">{{ post.excerpt }}</div>
                </div>
              </div>
            </td>
            <td class="hidden md:table-cell">
              {{
                post.status === 'published'
                  ? `Published on ${post.publishedAt?.toLocaleDateString()}`
                  : `Last updated ${post.updatedAt.toLocaleDateString()}`
              }}
            </td>
            <td class="hidden md:table-cell">
              <div class="flex flex-wrap gap-1">
                <div v-for="category in post.categories.slice(0, 2)" :key="category" class="badge badge-outline">
                  {{ category }}
                </div>
                <div v-if="post.categories.length > 2" class="badge badge-outline">
                  +{{ post.categories.length - 2 }}
                </div>
              </div>
            </td>
            <td class="hidden md:table-cell">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1" title="Likes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                    </path>
                  </svg>
                  {{ post.likeCount }}
                </div>
                <div class="flex items-center gap-1" title="Comments">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                    </path>
                  </svg>
                  {{ post.commentCount }}
                </div>
                <div class="flex items-center gap-1" title="Read Time">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {{ post.readTime }} min
                </div>
              </div>
            </td>
            <td>
              <div :class="`badge ${post.status === 'published' ? 'badge-success' : 'badge-secondary'}`">
                {{ post.status === 'published' ? 'Published' : 'Draft' }}
              </div>
            </td>
            <td>
              <div class="dropdown dropdown-end">
                <label for="" tabindex="0" class="btn btn-ghost btn-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </label>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button @click="editPost(post.slug)">Edit</button></li>
                  <li v-if="post.status === 'published'">
                    <button @click="viewPost(post.slug)">View</button>
                  </li>
                  <li>
                    <button @click="togglePublishStatus(post)">
                      {{ post.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                  </li>
                  <li><button class="text-error" @click="deletePost(post)">Delete</button></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
