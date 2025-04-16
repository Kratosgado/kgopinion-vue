import {
  Home,
  About,
  Contact,
  Articles,
  Categories,
  PostView,
  Auth,
  Profile,
  Dashboard,
  PostEditor,
} from '@/views'
import EditotTest from '@/views/editor/EditotTest.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/articles', component: Articles },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/articles', component: Articles },
  { path: '/articles/categories', component: Categories },
  { path: '/articles/:slug', component: PostView },
  { path: '/auth', component: Auth },
  { path: '/auth/profile', component: Profile },
  { path: '/auth/dashboard', component: Dashboard },
  { path: '/editor', component: PostEditor },
  { path: '/test', component: EditotTest },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
