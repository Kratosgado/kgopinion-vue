import HelloWorld from '@/components/HelloWorld.vue'
import { Home, About, Contact, Articles, Categories } from '@/views'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/articles', component: HelloWorld },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/articles', component: Articles },
  { path: '/articles/categories', component: Categories },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
