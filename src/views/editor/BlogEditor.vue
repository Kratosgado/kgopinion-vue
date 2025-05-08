<script setup lang="ts">
import { useBlogEditor } from '@/components/editor/useEditor'
import { useSeo } from '@/components/editor/useSeo'
import { useEditorStore } from '@/stores/editorStore'
import { MutationType } from 'pinia'
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import EditorContent from './EditorContent.vue'
import SeoPanel from './SeoPanel.vue'
import EditorSidebar from './EditorSidebar.vue'
import EditorTopBar from './EditorTopBar.vue'
import { useRoute } from 'vue-router'
import Preview from './Preview.vue'

const editorStore = useEditorStore()
const { destroyEditor } = useBlogEditor()
const { analyzeSeo } = useSeo()
const view = ref<'editor' | 'preview' | 'code'>('editor')

onMounted(() => {
  const slug = useRoute().params.slug as string
  if (slug !== 'new') {
    editorStore.loadPost(slug)
  }
  // Auto-save every 30 seconds
  const autoSaveInterval = setInterval(() => {
    editorStore.saveContent('draft')
  }, 30000)

  // Clean up on unmount
  onBeforeUnmount(() => {
    clearInterval(autoSaveInterval)
    destroyEditor()
  })
})

function changeView(newView: 'editor' | 'preview' | 'code') {
  view.value = newView
}

// Watch editor content and analyze SEO when content changes
editorStore.$subscribe((mutation, state) => {
  if (mutation.type === MutationType.direct) {
    analyzeSeo(state.content)
  }
})
</script>

<template>
  <div class="blog-editor-container h-screen flex flex-col">
    <EditorTopBar @change-view="changeView" />
    <div class="flex-1 flex overflow-hidden">
      <EditorSidebar />
      <section class="flex-1 overflow-auto p-6">
        <div class="max-w-4xl mx-auto bg-base-200 shadow-md rounded-lg">
          <EditorContent v-if="view === 'editor'" />
          <Preview v-else-if="view === 'preview'" />
          <pre v-else><code>{{ editorStore.content }}</code></pre>
          <!-- <textarea -->
          <!--   v-if="view === 'code'" -->
          <!--   class="input input-primary w-full" -->
          <!--   v-model="editorStore.content" -->
          <!-- /> -->
        </div>
      </section>
      <SeoPanel />
    </div>
  </div>
</template>
