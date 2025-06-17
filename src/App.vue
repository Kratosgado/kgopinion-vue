<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue'
import { defineAsyncComponent } from 'vue'
import { isLoading } from './stores/isLoading'
import LoadingPage from './components/LoadingPage.vue'
import NavLinks from './components/NavLinks.vue'

const ProfileDropdown = defineAsyncComponent(() => import('./components/ProfileDropdown.vue'))
</script>

<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar w-full bg-base-300">
        <div class="flex-none lg:hidden">
          <label for="my-drawer-3" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <img alt="logo" src="/favicon.ico" class="w-10 rounded-full" />
        <div class="mx-2 flex-1 px-2">
          <RouterLink to="/" class="text-xl font-bold">Kratosgado</RouterLink>
        </div>
        <div class="hidden flex-none lg:block">
          <ul class="menu lg:menu-horizontal items-center rounded-box">
            <!-- Public navigation -->
            <NavLinks />

            <ProfileDropdown v-if="$route.path.startsWith('/auth')" />
          </ul>
        </div>
      </div>

      <!-- Page content -->
      <main class="min-h-svh">
        <Transition>
          <LoadingPage v-show="isLoading" v-if="isLoading" />
        </Transition>
        <RouterView v-show="!isLoading" v-slot="{ Component }">
          <Transition>
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <Footer />
    </div>

    <!-- Mobile drawer -->
    <div class="drawer-side">
      <label for="my-drawer-3" class="drawer-overlay"></label>
      <ul class="menu h-full w-80 bg-base-200 p-4">
        <!-- Mobile navigation -->
        <NavLinks />

        <!-- Divider -->
        <div class="divider"></div>
      </ul>
    </div>
  </div>
</template>
<style>
html,
body {
  height: 100%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
