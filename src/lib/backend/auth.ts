// src/composables/useAuth.ts
import { reactive, onMounted } from 'vue'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { firebaseAuth } from '@/lib/utils' // Adjust path as needed
import { addAuthor, getAuthor, updateAuthor } from './user.query'
import type { Author } from '@/lib/utils'

// Define AuthState type
export type AuthState = {
  user: Author | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Create auth composable
export const useAuth = () => {
  const state = reactive<AuthState>({ ...initialState })

  // Initialize auth state
  const initialize = async (u: User | null) => {
    state.isLoading = true
    state.error = null

    try {
      if (u) {
        if (!(await getAuthor(u.uid))) {
          console.log('adding author')
          await addAuthor(u)
        }
        const user = (await getAuthor(u.uid)) || null

        Object.assign(state, {
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        Object.assign(state, {
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (err) {
      console.error('Auth initialization failed:', err)
      Object.assign(state, {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to authenticate',
      })
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    state.isLoading = true
    state.error = null

    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
      if (!(await getAuthor(user.uid))) {
        console.log('adding author')
        await addAuthor(user)
      }
      const us = (await getAuthor(user.uid)) || null

      Object.assign(state, {
        user: us,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (err) {
      console.error('Sign in failed:', err)
      Object.assign(state, {
        isLoading: false,
        error: 'Invalid email or password',
      })
      return false
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    state.isLoading = true
    state.error = null

    try {
      const { user } = await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
      if (!(await getAuthor(user.uid))) {
        console.log('adding author')
        await addAuthor(user)
      }
      const us = (await getAuthor(user.uid)) || null

      Object.assign(state, {
        user: us,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (err) {
      console.error('Google sign in failed:', err)
      Object.assign(state, {
        isLoading: false,
        error: 'Failed to sign in with Google',
      })
      return false
    }
  }

  // Sign out
  const signOutUser = async () => {
    state.isLoading = true

    try {
      await signOut(firebaseAuth)

      Object.assign(state, {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      return true
    } catch (err) {
      console.error('Sign out failed:', err)
      Object.assign(state, {
        isLoading: false,
        error: 'Failed to sign out',
      })
      return false
    }
  }

  // Update user profile
  const updateProfile = async (userData: Partial<Author>) => {
    state.error = null

    try {
      await updateAuthor(userData)

      Object.assign(state, {
        user: state.user ? { ...state.user, ...userData } : null,
        isLoading: false,
      })

      return true
    } catch (err) {
      console.error('Profile update failed:', err)
      Object.assign(state, {
        isLoading: false,
        error: 'Failed to update profile',
      })
      return false
    }
  }

  // Clear error
  const clearError = () => {
    state.error = null
  }

  // Initialize auth state on mount (client-side only)
  onMounted(() => {
    if (typeof window !== 'undefined') {
      firebaseAuth.onAuthStateChanged((user) => {
        initialize(user)
      })
    }
  })

  return {
    state,
    signIn,
    signInWithGoogle,
    signOut: signOutUser,
    updateProfile,
    clearError,
  }
}
