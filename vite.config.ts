import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import cssnano from 'cssnano'
import cssnanoPlugin from 'cssnano'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer(), tailwindcss(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [cssnanoPlugin()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          tiptap: ['@tiptap/vue-3', '@tiptap/starter-kit'],
          firebase: ['firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
})
