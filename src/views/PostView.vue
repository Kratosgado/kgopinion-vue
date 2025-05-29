<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type Post, type Comment } from '@/lib/utils/types'
import type { SEOMetadata } from '@/lib/seo/types'
import SEO from '@/lib/seo/SEO.vue'
import { isLoading } from '@/stores/isLoading'
import IconTwitter from '@/components/icons/IconTwitter.vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'
import Article from '@/components/Article.vue'
import { Query } from '@/lib/backend/query'
import TOComp from '@/components/editor/TOComp.vue'

const route = useRoute()
const { post } = defineProps<{ post: Post | null }>()
let article: Post | undefined
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
  isLoading.value = true
  try {
    article = await new Query<Post>('posts')
      .one()
      .whereEqualTo('slug', route.params.slug as string)
      .setJoin()
      .get()
    if (article) {
      metadata.value = {
        title: article.title,
        description: article.excerpt,
        keywords: article.tags || [],
        type: 'article',
        ogImage: article.featuredImage,
        publishedTime: article.publishedAt?.toUTCString(),
        modifiedTime: article.updatedAt.toUTCString(),
        author: article.author?.name,
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
onBeforeMount(() => {
  if (!post) fetchPost()
  else article = post
})
const handleLike = () => {
  if (article) {
    article.likeCount += 1
    // togglePostLike(article.slug)
  }
}

const submitComment = () => {
  if (newComment.value && article) {
    const comment: Comment = {
      id: `comment${comments.value.length + 1}`,
      postId: article.slug,
      authorName: 'Current User',
      authorAvatar: 'https://i.pravatar.cc/150?u=user',
      content: newComment.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
    }

    comments.value = [comment, ...comments.value]
    article.commentCount += 1
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
    <div v-if="article" class="relative h-[40vh] w-full">
      <img
        :src="article.featuredImage || '/favicon.ico'"
        :alt="article.title"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="max-w-4xl px-4 text-center text-white">
          <div class="mb-4 flex flex-wrap justify-center gap-2">
            <div v-for="category in article.categories" :key="category" class="badge badge-primary">
              {{ category }}
            </div>
          </div>
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">{{ article.title }}</h1>
          <div class="flex items-center justify-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <img
                :src="article.author?.avatar || '/favicon.ico'"
                :alt="article.author?.name"
                class="h-8 w-8 rounded-full"
              />
              <span>{{ article.author?.name }}</span>
            </div>
            <span class="mx-2">•</span>
            <span>{{ article.publishedAt?.toLocaleDateString() }}</span>
            <span class="mx-2">•</span>
            <span>{{ article.readTime }} min read</span>
          </div>
        </div>
      </div>
    </div>

    <section v-if="article" class="container mx-auto px-4 py-10">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- col 1 -->
        <div>
          <TOComp :title="article.title" :active-offset="100" :content="article.content" />
        </div>

        <!-- col 2-->
        <div class="lg:col-span-2">
          <Article :content="article.content" :excerpt="article.excerpt" />

          <div class="mt-8 flex flex-wrap items-center justify-between border-t pt-6">
            <div class="flex items-center gap-4">
              <button class="btn btn-outline gap-2" @click="handleLike">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
                {{ article.likeCount }} Likes
              </button>
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  ></path>
                </svg>
                {{ article.commentCount }} Comments
              </div>
            </div>

            <div class="mt-4 flex gap-2 sm:mt-0">
              <IconTwitter
                v-if="article.author?.social?.twitter"
                :link="article.author?.social?.twitter"
              />
              <IconGithub
                v-if="article.author?.social?.github"
                :link="article.author?.social?.github"
              />
              <IconLinkedIn
                v-if="article.author?.social?.linkedIn"
                :link="article.author?.social?.linkedIn"
              />
            </div>
          </div>

          <div
            v-if="article.author"
            class="mt-8 flex flex-col items-center gap-6 rounded-lg bg-base-200 p-6 sm:flex-row sm:items-start"
          >
            <img
              :src="article.author.avatar || '/favicon.ico'"
              :alt="article.author.name"
              class="h-24 w-24 rounded-full"
            />
            <div>
              <h3 class="mb-2 text-xl font-bold">About {{ article.author.name }}</h3>
              <p class="mb-4">{{ article.author.bio || 'No bio available.' }}</p>
              <div class="flex gap-2">
                <IconTwitter
                  v-if="article.author?.social?.twitter"
                  :link="article.author?.social?.twitter"
                />
                <IconGithub
                  v-if="article.author?.social?.github"
                  :link="article.author?.social?.github"
                />
                <IconLinkedIn
                  v-if="article.author?.social?.linkedIn"
                  :link="article.author?.social?.linkedIn"
                />
              </div>
            </div>
          </div>

          <div class="mt-12">
            <h3 class="mb-6 text-2xl font-bold">Comments ({{ article.commentCount }})</h3>

            <div class="mb-8">
              <textarea
                v-model="newComment"
                placeholder="Leave a comment..."
                class="textarea textarea-bordered h-24 w-full"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button class="btn btn-primary" @click="submitComment">Post Comment</button>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="comment in comments.filter((c) => !c.parentId)"
                :key="comment.id"
                class="rounded-lg bg-base-100 p-4 shadow-sm"
              >
                <div class="flex items-start gap-4">
                  <img
                    :src="comment.authorAvatar || '/placeholder.svg'"
                    :alt="comment.authorName"
                    class="h-10 w-10 rounded-full"
                  />
                  <div class="flex-1">
                    <div class="mb-2 flex items-center justify-between">
                      <div>
                        <span class="font-bold">{{ comment.authorName }}</span>
                        <span class="ml-2 text-sm text-gray-500">{{
                          comment.createdAt.toLocaleDateString()
                        }}</span>
                      </div>
                      <button class="btn btn-ghost btn-xs gap-1" @click="likeComment(comment.id)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                          ></path>
                        </svg>
                        {{ comment.likes }}
                      </button>
                    </div>
                    <p>{{ comment.content }}</p>

                    <div
                      v-for="reply in comments.filter((c) => c.parentId === comment.id)"
                      :key="reply.id"
                      class="ml-6 mt-4 rounded-lg bg-base-200 p-3"
                    >
                      <div class="flex items-start gap-3">
                        <img
                          :src="reply.authorAvatar || '/placeholder.svg'"
                          :alt="reply.authorName"
                          class="h-8 w-8 rounded-full"
                        />
                        <div class="flex-1">
                          <div class="mb-1 flex items-center justify-between">
                            <div>
                              <span class="font-bold">{{ reply.authorName }}</span>
                              <span class="ml-2 text-sm text-gray-500">{{
                                reply.createdAt.toLocaleDateString()
                              }}</span>
                            </div>
                            <button
                              class="btn btn-ghost btn-xs gap-1"
                              @click="likeComment(reply.id)"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path
                                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                                ></path>
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

        <!-- col 3 -->
        <aside class="lg:col-span-1">
          <div v-if="article.tags?.length" class="mb-8 rounded-box bg-base-100 p-6 shadow-xl">
            <h3 class="mb-4 text-xl font-bold">Keywords</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="keyword in article.tags" :key="keyword" class="badge badge-outline">{{
                keyword
              }}</span>
            </div>
          </div>

          <div v-if="relatedPosts.length" class="mb-8 rounded-box bg-base-100 p-6 shadow-xl">
            <h3 class="mb-4 text-xl font-bold">Related Posts</h3>
            <div class="space-y-6">
              <div v-for="relatedPost in relatedPosts" :key="relatedPost.slug" class="flex gap-4">
                <img
                  :src="relatedPost.featuredImage || '/placeholder.svg'"
                  :alt="relatedPost.title"
                  class="h-20 w-20 rounded-md object-cover"
                />
                <div>
                  <div class="badge badge-sm mb-1">{{ relatedPost.categories[0] }}</div>
                  <h4 class="font-bold hover:text-primary">
                    <router-link :to="`/${relatedPost.slug}`">{{ relatedPost.title }}</router-link>
                  </h4>
                  <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{{ relatedPost.readTime }} min read</span>
                    <span>•</span>
                    <div class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        ></path>
                      </svg>
                      {{ relatedPost.likeCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
