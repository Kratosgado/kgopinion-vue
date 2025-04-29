<script setup lang="ts">
import { useAuth } from '@/lib/backend/auth'

const { state: authState, signOut } = useAuth()
</script>
<template v-if="authState?.isAuthenticated && authState.user">
  <li>
    <details>
      <summary>
        <div class="avatar">
          <div class="h-8 w-8 rounded-full">
            <img :src="authState.user?.avatar || '/favicon.ico'" :alt="authState.user?.name" />
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
          <RouterLink to="/" @click.prevent="signOut">Sign Out</RouterLink>
        </li>
      </ul>
    </details>
  </li>
</template>
