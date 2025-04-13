import HelloWorld from '@/components/HelloWorld.vue'
import { Home } from '@/views'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/articles', component: HelloWorld },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
