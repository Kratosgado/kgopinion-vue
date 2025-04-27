<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Footer } from '@/components'
import { useAuth } from './lib'

const { state: authState, signOut } = useAuth()
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
          <ul class="menu menu-horizontal items-center">
            <!-- Public navigation -->
            <li>
              <RouterLink to="/" :class="{ active: $route.path === '/' }">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="/articles" :class="{ active: $route.path === '/articles' }"
                >Articles</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/articles/categories"
                :class="{ active: $route.path === '/articles/categories' }"
              >
                Categories</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/about" :class="{ active: $route.path === '/about' }"
                >About</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/contact" :class="{ active: $route.path === '/contact' }"
                >Contact</RouterLink
              >
            </li>

            <!-- Authenticated navigation -->
            <template v-if="authState?.isAuthenticated && authState.user">
              <li>
                <details>
                  <summary>
                    <div class="avatar">
                      <div class="h-8 w-8 rounded-full">
                        <img
                          :src="authState.user.avatar || '/favicon.ico'"
                          :alt="authState.user.name"
                        />
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
            <template v-else-if="!authState?.isLoading">
              <li>
                <RouterLink to="/auth" class="btn btn-primary">Sign In</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <!-- Page content -->
      <main>
        <RouterView />
      </main>

      <Footer />
    </div>

    <!-- Mobile drawer -->
    <div class="drawer-side">
      <label for="my-drawer-3" class="drawer-overlay"></label>
      <ul class="menu h-full w-80 bg-base-200 p-4">
        <!-- Mobile navigation -->
        <li aria-label="home">
          <RouterLink to="/" :class="{ active: $route.path === '/' }">Home</RouterLink>
        </li>
        <li aria-label="articles">
          <RouterLink to="/articles" :class="{ active: $route.path === '/articles' }"
            >Articles</RouterLink
          >
        </li>
        <li aria-label="categories">
          <RouterLink
            to="/articles/categories"
            :class="{ active: $route.path === '/articles/categories' }"
          >
            Categories</RouterLink
          >
        </li>
        <li aria-label="about">
          <RouterLink to="/about" :class="{ active: $route.path === '/about' }">About</RouterLink>
        </li>
        <li aria-label="contact">
          <RouterLink to="/contact" :class="{ active: $route.path === '/contact' }"
            >Contact</RouterLink
          >
        </li>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Authenticated navigation for mobile -->
        <template v-if="authState?.isAuthenticated && authState?.user">
          <li class="menu-title">
            <div class="flex items-center gap-2">
              <div class="avatar">
                <div class="h-8 w-8 rounded-full">
                  <img :src="authState.user.avatar || '/favicon.svg'" :alt="authState.user.name" />
                </div>
              </div>
              <span>{{ authState.user.name }}</span>
            </div>
          </li>
          <li>
            <RouterLink to="/auth/dashboard">Dashboard</RouterLink>
          </li>
          <li>
            <RouterLink to="/auth/profile">Profile</RouterLink>
          </li>
          <li>
            <RouterLink to="/editor">New Post</RouterLink>
          </li>
          <li>
            <RouterLink to="/" @click.prevent="signOut">Sign Out</RouterLink>
          </li>
        </template>
        <template v-else-if="!authState?.isLoading">
          <li>
            <RouterLink to="/auth" class="btn btn-primary justify-start">Sign In</RouterLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<style>
html,
body {
  height: 100%;
}
</style>
