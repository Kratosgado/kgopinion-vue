<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { type Post, type Comment, type SEOMetadata, SEO, togglePostLike } from '@/lib'
import { getPostBySlug } from '@/lib/backend/post.query'
import { Loading } from '@/components'

const route = useRoute()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const relatedPosts = ref<Post[]>([])
const newComment = ref('')

const metadata = ref<SEOMetadata>({
  title: '',
  description: '',
  keywords: [],
  type: 'article',
  ogImage: '',
  publishedTime: '',
  modifiedTime: '',
  author: '',
})

const fetchPost = async () => {
  try {
    post.value = await getPostBySlug(route.params.slug as string)
    if (post.value) {
      metadata.value = {
        title: post.value.title,
        description: post.value.excerpt,
        keywords: post.value.keywords || [],
        type: 'article',
        ogImage: post.value.featuredImage,
        publishedTime: post.value.createdAt.toUTCString(),
        modifiedTime: post.value.updatedAt.toUTCString(),
        author: post.value.author?.name,
      }
    }
  } catch (err) {
    console.error(err)
  }
}

fetchPost()

const handleLike = () => {
  if (post.value) {
    post.value.likeCount += 1
    togglePostLike(post.value.slug)
  }
}

const submitComment = () => {
  if (newComment.value && post.value) {
    const comment: Comment = {
      id: `comment${comments.value.length + 1}`,
      postId: post.value.slug,
      authorName: 'Current User',
      authorAvatar: 'https://i.pravatar.cc/150?u=user',
      content: newComment.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
    }

    comments.value = [comment, ...comments.value]
    post.value.commentCount += 1
    newComment.value = ''
  }
}

const likeComment = (commentId: string) => {
  comments.value = comments.value.map((comment) =>
    comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
  )
}
</script>

<template>
  <div>
    <SEO :metadata="metadata" />

    <div v-if="post" class="relative h-[40vh] w-full">
      <img :src="post.featuredImage || '/favicon.ico'" :alt="post.title" class="h-full w-full object-cover" />
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="max-w-4xl px-4 text-center text-white">
          <div class="mb-4 flex flex-wrap justify-center gap-2">
            <div v-for="category in post.categories" :key="category" class="badge badge-primary">
              {{ category }}
            </div>
          </div>
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">{{ post.title }}</h1>
          <div class="flex items-center justify-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <img :src="post.author?.avatar || '/favicon.ico'" :alt="post.author?.name" class="h-8 w-8 rounded-full" />
              <span>{{ post.author?.name }}</span>
            </div>
            <span class="mx-2">•</span>
            <span>{{ post.publishedAt?.toLocaleDateString() }}</span>
            <span class="mx-2">•</span>
            <span>{{ post.readTime }} min read</span>
          </div>
        </div>
      </div>
    </div>

    <main v-if="post" class="container mx-auto px-4 py-10">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <article class="prose prose-lg max-w-none">
            <p v-if="post.excerpt" class="lead text-xl font-medium italic">{{ post.excerpt }}</p>
            <hr v-if="post.excerpt" class="my-6" />
            <div v-html="post.content"></div>
          </article>

          <div class="mt-8 flex flex-wrap items-center justify-between border-t pt-6">
            <div class="flex items-center gap-4">
              <button class="btn btn-outline gap-2" @click="handleLike">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                  </path>
                </svg>
                {{ post.likeCount }} Likes
              </button>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                  </path>
                </svg>
                {{ post.commentCount }} Comments
              </div>
            </div>

            <div class="mt-4 flex gap-2 sm:mt-0">
              <a :href="post.author?.social?.twitter" aria-label="twitter" class="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a :href="post.author?.social?.twitter" aria-label="twitter" class="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                  </path>
                </svg>
              </a>
              <a :href="post.author?.social?.twitter" aria-label="twitter" class="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div v-if="post.author"
            class="mt-8 flex flex-col items-center gap-6 rounded-lg bg-base-200 p-6 sm:flex-row sm:items-start">
            <img :src="post.author.avatar || '/favicon.ico'" :alt="post.author.name" class="h-24 w-24 rounded-full" />
            <div>
              <h3 class="mb-2 text-xl font-bold">About {{ post.author.name }}</h3>
              <p class="mb-4">{{ post.author.bio || 'No bio available.' }}</p>
              <div class="flex gap-2">
                <a v-if="post.author.social?.twitter" :href="`https://twitter.com/${post.author.social.twitter}`"
                  target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Twitter</a>
                <a v-if="post.author.social?.github" :href="`https://github.com/${post.author.social.github}`"
                  target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">GitHub</a>
                <a v-if="post.author.social?.linkedIn" :href="`https://linkedin.com/in/${post.author.social.linkedIn}`"
                  target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">LinkedIn</a>
              </div>
            </div>
          </div>

          <div class="mt-12">
            <h3 class="mb-6 text-2xl font-bold">Comments ({{ post.commentCount }})</h3>

            <div class="mb-8">
              <textarea v-model="newComment" placeholder="Leave a comment..."
                class="textarea textarea-bordered h-24 w-full"></textarea>
              <div class="mt-2 flex justify-end">
                <button class="btn btn-primary" @click="submitComment">Post Comment</button>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="comment in comments.filter((c) => !c.parentId)" :key="comment.id"
                class="rounded-lg bg-base-100 p-4 shadow-sm">
                <div class="flex items-start gap-4">
                  <img :src="comment.authorAvatar || '/placeholder.svg'" :alt="comment.authorName"
                    class="h-10 w-10 rounded-full" />
                  <div class="flex-1">
                    <div class="mb-2 flex items-center justify-between">
                      <div>
                        <span class="font-bold">{{ comment.authorName }}</span>
                        <span class="ml-2 text-sm text-gray-500">{{
                          comment.createdAt.toLocaleDateString()
                          }}</span>
                      </div>
                      <button class="btn btn-ghost btn-xs gap-1" @click="likeComment(comment.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path
                            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                          </path>
                        </svg>
                        {{ comment.likes }}
                      </button>
                    </div>
                    <p>{{ comment.content }}</p>

                    <div v-for="reply in comments.filter((c) => c.parentId === comment.id)" :key="reply.id"
                      class="ml-6 mt-4 rounded-lg bg-base-200 p-3">
                      <div class="flex items-start gap-3">
                        <img :src="reply.authorAvatar || '/placeholder.svg'" :alt="reply.authorName"
                          class="h-8 w-8 rounded-full" />
                        <div class="flex-1">
                          <div class="mb-1 flex items-center justify-between">
                            <div>
                              <span class="font-bold">{{ reply.authorName }}</span>
                              <span class="ml-2 text-sm text-gray-500">{{
                                reply.createdAt.toLocaleDateString()
                                }}</span>
                            </div>
                            <button class="btn btn-ghost btn-xs gap-1" @click="likeComment(reply.id)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                                </path>
                              </svg>
                              {{ reply.likes }}
                            </button>
                          </div>
                          <p>{{ reply.content }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div v-if="post.keywords?.length" class="mb-8 rounded-box bg-base-100 p-6 shadow-xl">
            <h3 class="mb-4 text-xl font-bold">Keywords</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="keyword in post.keywords" :key="keyword" class="badge badge-outline">{{
                keyword
                }}</span>
            </div>
          </div>

          <div v-if="relatedPosts.length" class="mb-8 rounded-box bg-base-100 p-6 shadow-xl">
            <h3 class="mb-4 text-xl font-bold">Related Posts</h3>
            <div class="space-y-6">
              <div v-for="relatedPost in relatedPosts" :key="relatedPost.slug" class="flex gap-4">
                <img :src="relatedPost.featuredImage || '/placeholder.svg'" :alt="relatedPost.title"
                  class="h-20 w-20 rounded-md object-cover" />
                <div>
                  <div class="badge badge-sm mb-1">{{ relatedPost.categories[0] }}</div>
                  <h4 class="font-bold hover:text-primary">
                    <router-link :to="`/${relatedPost.slug}`">{{ relatedPost.title }}</router-link>
                  </h4>
                  <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{{ relatedPost.readTime }} min read</span>
                    <span>•</span>
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                        </path>
                      </svg>
                      {{ relatedPost.likeCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="container mx-auto px-4 py-20 text-center">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4">Loading post...</p>
    </div>
  </div>
</template>
