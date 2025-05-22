<script setup lang="ts">
import { useAuth } from '@/lib/backend/auth'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
const auth = useAuth()
const router = useRouter()

watch(
  () => auth.state.isLoading,
  (isLoading) => {
    if (!isLoading && !auth.state.isAuthenticated) {
      const returnUrl = router.currentRoute.value.path
      router.replace('/auth?returnUrl=' + returnUrl)
    } else if (auth.state.isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = decodeURIComponent(urlParams.get('returnUrl') || '/auth/dashboard')
      router.replace(returnUrl)
    }
  },
)
</script>

<template v-if="auth.state?.isAuthenticated && authState.user">
  <li>
    <details>
      <summary>
        <div class="avatar">
          <div class="h-8 w-8 rounded-full">
            <img :src="auth.state.user?.avatar || '/favicon.ico'" :alt="auth.state.user?.name" />
          </div>
        </div>
      </summary>
      <ul class="rounded-t-none bg-base-100 p-2">
        <li>
          <RouterLink to="/auth/dashboard">Dashboard</RouterLink>
        </li>
        <li>
          <RouterLink to="/auth/profile">Profile</RouterLink>
        </li>
        <li>
          <RouterLink to="/auth" @click.prevent="auth.signOut">Sign Out</RouterLink>
        </li>
      </ul>
    </details>
  </li>
</template>
