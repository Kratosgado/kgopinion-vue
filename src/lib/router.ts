import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/articles', component: () => import('../views/Articles.vue') },
  { path: '/about', component: () => import('../views/About.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  { path: '/articles', component: () => import('../views/Articles.vue') },
  { path: '/articles/categories', component: () => import('../views/Categories.vue') },
  { path: '/articles/:slug', component: () => import('../views/PostView.vue') },
  { path: '/auth', component: () => import('../views/Auth.vue') },
  { path: '/auth/profile', component: () => import('../views/Profile.vue') },
  { path: '/auth/dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/auth/editor/:slug', component: () => import('../views/editor/BlogEditor.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
