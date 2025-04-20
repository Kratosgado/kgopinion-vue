<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SEO, useAuth, type SEOMetadata } from '@/lib'

const router = useRouter()
const metadata: SEOMetadata = {
  title: 'Sign in - Kratosgado',
  description: 'Become a creator',
  keywords: ['Kratosgado', 'blogger', 'contact', 'developer'],
}

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const isRegistering = ref(false)
const name = ref('')
const confirmPassword = ref('')

const auth = useAuth()
const authState = auth.state

// Subscribe to auth changes
if (authState.isAuthenticated) {
  const urlParams = new URLSearchParams(window.location.search)
  const returnUrl = decodeURIComponent(urlParams.get('returnUrl') || '/dashboard')
  router.push(returnUrl)
}

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (isRegistering.value && password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (await auth.signIn(email.value, password.value)) {
    router.push('/dashboard')
  }
}

const resetPassword = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Password reset email sent. Please check your inbox.')
  } catch (err) {
    console.error(err)
    error.value = 'Failed to send password reset email. Please try again.'
  }
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  error.value = ''
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-200 px-4">
    <SEO :metadata="metadata" />
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mx-auto mb-2 text-center text-2xl font-bold">
          {{ isRegistering ? 'Create Account' : 'Welcome Back' }}
        </h2>
        <p class="mb-6 text-center text-gray-500">
          {{
            isRegistering
              ? 'Create an account to start publishing your articles'
              : 'Sign in to access your dashboard and manage your content'
          }}
        </p>

        <div v-if="error" class="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ error }}</span>
        </div>

        <button
          class="btn btn-outline mb-4 w-full gap-2"
          @click="auth.signInWithGoogle"
          :disabled="authState.isLoading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Continue with Google
        </button>

        <div class="divider">OR</div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="isRegistering" class="form-control">
            <label class="label" for="name">
              <span class="label-text">Full Name</span>
            </label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="John Doe"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="your@email.com"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label" for="password">
              <span class="label-text">Password</span>
              <button
                v-if="!isRegistering"
                type="button"
                class="link-hover link label-text-alt"
                @click="resetPassword"
                :disabled="authState.isLoading"
              >
                Forgot password?
              </button>
            </label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="••••••••"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div v-if="isRegistering" class="form-control">
            <label class="label" for="confirmPassword">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div v-if="!isRegistering" class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input v-model="rememberMe" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">Remember me</span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary w-full" :disabled="authState.isLoading">
              <span v-if="authState.isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isRegistering ? 'Create Account' : 'Sign In' }}
            </button>
          </div>
        </form>

        <div class="mt-4 text-center">
          <p>
            {{ isRegistering ? 'Already have an account?' : "Don't have an account?" }}
            <button
              type="button"
              class="link link-primary"
              @click="toggleMode"
              :disabled="authState.isLoading"
            >
              {{ isRegistering ? 'Sign In' : 'Register' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
