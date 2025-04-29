import { type Category, type Author, type Post, type Comment } from '@/lib/utils/types'
import {
  addDoc,
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { getCollRef, getDocRef } from './helpers'

// Add a comment
export const addComment = async (
  commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>,
) => {
  const commentsRef = getCollRef('comments')

  const newComment = {
    ...commentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likes: 0,
  }

  const docRef = await addDoc(commentsRef, newComment)

  // Update post comment count
  await updateDoc(getDocRef('posts', commentData.postId), {
    commentCount: increment(1),
  })

  return { id: docRef.id, ...newComment }
}

// Get comments for a post
export const getPostComments = async (postId: string) => {
  const commentsQuery = query(
    getCollRef('comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc'),
  )

  const querySnapshot = await getDocs(commentsQuery)

  const comments = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Comment),
    id: doc.id,
  }))

  return comments
}

// Update a comment
export const updateComment = async (commentId: string, content: string) => {
  const commentRef = getDocRef('comments', commentId)

  await updateDoc(commentRef, {
    content,
    updatedAt: serverTimestamp(),
  })

  return true
}

// Delete a comment
export const deleteComment = async (commentId: string) => {
  const commentRef = getDocRef('comments', commentId)
  const commentSnapshot = await getDoc(commentRef)

  if (!commentSnapshot.exists()) {
    throw new Error(`Comment with ID ${commentId} does not exist`)
  }

  const commentData = commentSnapshot.data() as Comment

  // Update post comment count
  await updateDoc(getDocRef('posts', commentData.postId), {
    commentCount: increment(-1),
  })

  // Delete the comment
  await deleteDoc(commentRef)
  return true
}

// CATEGORIES QUERIES

// Create a new category
export const createCategory = async (categoryData: Omit<Category, 'id' | 'postCount'>) => {
  const categoriesRef = getCollRef('categories')

  // Check if slug already exists
  const slugQuery = query(categoriesRef, where('slug', '==', categoryData.name))
  const slugSnapshot = await getDocs(slugQuery)

  if (!slugSnapshot.empty) {
    throw new Error(`Category with slug "${categoryData.name}" already exists`)
  }

  const newCategory = {
    ...categoryData,
    postCount: 0,
  }

  const docRef = await addDoc(categoriesRef, newCategory)

  return { id: docRef.id, ...newCategory }
}

// Get all categories
export const getAllCategories = async () => {
  const categoriesQuery = query(getCollRef('categories'), orderBy('name', 'asc'))

  const querySnapshot = await getDocs(categoriesQuery)

  const categories = querySnapshot.docs.map((doc) => doc.data() as Category)

  return categories
}

// Update a category
export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Omit<Category, 'id' | 'postCount'>>,
) => {
  const categoryRef = getDocRef('categories', categoryId)

  // If slug is being updated, check if new slug already exists
  if (categoryData.name) {
    const categoriesRef = getCollRef('categories')
    const slugQuery = query(categoriesRef, where('slug', '==', categoryData.name))
    const slugSnapshot = await getDocs(slugQuery)

    if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== categoryId) {
      throw new Error(`Category with slug "${categoryData.name}" already exists`)
    }
  }

  await updateDoc(categoryRef, categoryData)

  return true
}

// Delete a category
export const deleteCategory = async (categoryId: string) => {
  const categoryRef = getDocRef('categories', categoryId)
  const categorySnapshot = await getDoc(categoryRef)

  if (!categorySnapshot.exists()) {
    throw new Error(`Category with ID ${categoryId} does not exist`)
  }

  const categoryData = categorySnapshot.data() as Category

  if (categoryData.postCount > 0) {
    throw new Error(`Cannot delete category with ${categoryData.postCount} posts`)
  }

  await deleteDoc(categoryRef)

  return true
}

// USER/AUTHOR QUERIES

// Create or update author profile
export const upsertAuthorProfile = async (authorId: string, authorData: Omit<Author, 'id'>) => {
  const authorRef = getDocRef('admins', authorId)

  await updateDoc(authorRef, {
    ...authorData,
    updatedAt: serverTimestamp(),
  })

  return { id: authorId, ...authorData }
}

// Get author by ID
export const getAuthorById = async (authorId: string) => {
  const authorRef = getDocRef('admins', authorId)
  const authorSnapshot = await getDoc(authorRef)

  if (!authorSnapshot.exists()) return null

  const authorData = authorSnapshot.data() as Author

  return { ...authorData, id: authorId }
}

// Get all authors
export const getAllAuthors = async () => {
  const authorsQuery = query(getCollRef('admins'), orderBy('displayName', 'asc'))

  const querySnapshot = await getDocs(authorsQuery)

  const authors = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Author),
    id: doc.id,
  }))

  return authors
}

// ANALYTICS AND STATS

// Get blog statistics
export const getBlogStatistics = async () => {
  // Get post count
  const postsQuery = query(getCollRef('posts'))
  const postsSnapshot = await getDocs(postsQuery)
  const totalPosts = postsSnapshot.size

  const publishedPostsQuery = query(getCollRef('posts'), where('published', '==', true))
  const publishedPostsSnapshot = await getDocs(publishedPostsQuery)
  const publishedPosts = publishedPostsSnapshot.size

  // Get comment count
  const commentsQuery = query(getCollRef('comments'))
  const commentsSnapshot = await getDocs(commentsQuery)
  const totalComments = commentsSnapshot.size

  // Get total views and likes
  const totalViews = 0
  let totalLikes = 0

  postsSnapshot.forEach((doc) => {
    const data = doc.data() as Post
    totalLikes += data.likeCount || 0
  })

  // Get category count
  const categoriesQuery = query(getCollRef('categories'))
  const categoriesSnapshot = await getDocs(categoriesQuery)
  const totalCategories = categoriesSnapshot.size

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalComments,
    totalViews,
    totalLikes,
    totalCategories,
    commentsPerPost: totalPosts > 0 ? totalComments / totalPosts : 0,
    viewsPerPost: totalPosts > 0 ? totalViews / totalPosts : 0,
    likesPerPost: totalPosts > 0 ? totalLikes / totalPosts : 0,
  }
}
