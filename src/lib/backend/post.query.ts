import {
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { getCollRef, getDocRef } from './helpers'
import { getAuthor } from './user.query'
import { generateSlug, parseDate } from './utils'
import type { Post } from '../utils/types'
import { db, firebaseAuth } from '../utils/firebase'

export async function savePostOrUpdate(postData: Post): Promise<string> {
  // Update existing document.
  const postRef = getDocRef('posts', `${postData.slug}-${postData.status}`)
  const postShot = await getDoc(postRef)
  const post = postShot.data() as Post
  delete postData.author
  await setDoc(
    postRef,
    {
      ...postData,
      slug: postData.slug,
      createdAt: postData.publishedAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  const batch = writeBatch(db)
  postData.categories.forEach((cat) => {
    if (!post.categories.includes(cat)) {
      const catref = getDocRef('categories', cat)
      batch.update(catref, {
        postCount: increment(1),
      })
    }
  })

  await batch.commit()

  return 'post updated successfully'
}

export async function getPostBySlug(slug: string) {
  const ref = getDocRef('posts', slug)
  const postShot = await getDoc(ref)
  if (!postShot.exists()) return undefined

  const post = parseDate<Post>(postShot.data())
  if (post.authorId) {
    post.author = await getAuthor(post.authorId)
  }

  return post
}

export async function deletePost(slug: string) {
  const ref = getDocRef('posts', slug)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) throw new Error(`Post with slug ${slug} does not exist`)

  const postData = snapshot.data() as Post

  const batch = writeBatch(db)
  postData.categories.forEach((cat) => {
    const categoryRef = getDocRef('categories', cat)
    batch.update(categoryRef, {
      postCount: increment(-1),
    })
  })

  const commentsQ = query(getCollRef('comments'), where('postId', '==', slug))
  const commentShots = await getDocs(commentsQ)
  commentShots.forEach((c) => {
    batch.delete(getDocRef('comments', c.id))
  })
  batch.delete(ref)
  return true
}

export async function getRecentPosts(limitCount = 10, lastVisible?: any, onlyPublished = true) {
  // let postsQ = query(getCollectionRef('posts'), orderBy('publishedAt', 'desc'));
  let postsQ = query(getCollRef('posts'))

  if (onlyPublished) {
    postsQ = query(postsQ, where('published', '==', true))
  }
  if (lastVisible) {
    postsQ = query(postsQ, startAfter(lastVisible), limit(limitCount))
  } else {
    postsQ = query(postsQ, limit(limitCount))
  }

  const querySnapshot = await getDocs(postsQ)
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

  const posts = querySnapshot.docs.map((doc) => parseDate(doc.data()))

  return {
    posts,
    lastVisible: lastVisible && parseDate(lastVisibleDoc),
  }
}

export async function getAllPosts() {
  let postsQ = query(getCollRef('posts'))
  postsQ = query(postsQ, where('published', '==', true))
  const querySnapshot = await getDocs(postsQ)
  return querySnapshot.docs.map((doc) => parseDate(doc.data()))
}

// Get posts by category
export const getPostsByCategory = async (
  cat: string,
  options: {
    limit?: number
    lastVisible?: any
    onlyPublished?: boolean
  },
) => {
  const { limit: limitCount = 10, lastVisible, onlyPublished = true } = options

  let postsQuery = query(
    getCollRef('posts'),
    where('categories', 'array-contains', cat),
    orderBy('publishedAt', 'desc'),
  )

  if (onlyPublished) {
    postsQuery = query(postsQuery, where('published', '==', true))
  }

  if (lastVisible) {
    postsQuery = query(postsQuery, startAfter(lastVisible), limit(limitCount))
  } else {
    postsQuery = query(postsQuery, limit(limitCount))
  }

  const querySnapshot = await getDocs(postsQuery)
  const lastVisibleDoc = parseDate(querySnapshot.docs[querySnapshot.docs.length - 1])

  const posts = querySnapshot.docs.map((doc) => parseDate(doc.data()))

  return {
    posts,
    lastVisible: lastVisibleDoc,
  }
}

// Get posts by author
export async function getPostsByAuthor(limitCount = 10, onlyPublished = false, lastVisible?: any) {
  let postsQuery = query(
    getCollRef('posts'),
    where('authorId', '==', firebaseAuth.currentUser?.uid),
    orderBy('publishedAt', 'desc'),
  )

  if (onlyPublished) {
    postsQuery = query(postsQuery, where('published', '==', true))
  }

  if (lastVisible) {
    postsQuery = query(postsQuery, startAfter(lastVisible), limit(limitCount))
  } else {
    postsQuery = query(postsQuery, limit(limitCount))
  }

  const querySnapshot = await getDocs(postsQuery)
  const posts = querySnapshot.docs.map((doc) => parseDate(doc.data()))
  return posts
}

//Search posts by title or content
export const searchPosts = async (
  searchTerm: string,
  options: {
    limit?: number
    lastVisible?: any
    onlyPublished?: boolean
  },
) => {
  //TODO: Note: Basic Firestore doesn't support full-text search
  // For production, consider Algolia, Elasticsearch, or Firestore extensions
  // This is a simple implementation with limitations

  const { limit: limitCount = 10, onlyPublished = true } = options

  // Convert to lowercase for case-insensitive search
  const searchTermLower = searchTerm.toLowerCase()

  let postsQuery = query(getCollRef('posts'), orderBy('title'))

  if (onlyPublished) {
    postsQuery = query(postsQuery, where('published', '==', true))
  }

  // Fetch all matching documents (not efficient, but necessary without full-text search)
  const querySnapshot = await getDocs(postsQuery)

  // Filter in memory
  const matchingPosts = querySnapshot.docs
    .filter((doc) => {
      const data = parseDate(doc.data())
      return (
        data.title.toLowerCase().includes(searchTermLower) ||
        data.content.toLowerCase().includes(searchTermLower) ||
        data.excerpt.toLowerCase().includes(searchTermLower) ||
        data.tags.some((keyword) => keyword.toLowerCase().includes(searchTermLower))
      )
    })
    .map((doc) => parseDate(doc.data()))
    .slice(0, limitCount)

  return matchingPosts
}

// Get most popular posts
export const getPopularPosts = async (options: { limit?: number; onlyPublished?: boolean }) => {
  const { limit: limitCount = 10, onlyPublished = true } = options

  let postsQuery = query(getCollRef('posts'), orderBy('viewCount', 'desc'))

  if (onlyPublished) {
    postsQuery = query(postsQuery, where('published', '==', true))
  }

  postsQuery = query(postsQuery, limit(limitCount))

  const querySnapshot = await getDocs(postsQuery)

  const posts = querySnapshot.docs.map((doc) => parseDate(doc.data()))

  return posts
}

// Toggle like for a post
export const togglePostLike = async (slug: string) => {
  const postRef = getDocRef('posts', slug)

  await updateDoc(postRef, {
    likeCount: increment(1),
  })
  return true // Now liked
}
