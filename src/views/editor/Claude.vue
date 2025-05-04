<script setup lang="ts">
import { useEditor } from '@/components/editor/useEditor'
import { useSeo } from '@/components/editor/useSeo'
import { useEditorStore } from '@/stores/editorStore'
import { useSeoStore } from '@/stores/seoStore'
import { MutationType } from 'pinia'
import { onMounted, onBeforeUnmount } from 'vue'
import EditorContent from './EditorContent.vue'
import SeoPanel from './SeoPanel.vue'
import EditorSidebar from './EditorSidebar.vue'
import EditorTopBar from './EditorTopBar.vue'

const editorStore = useEditorStore()
const seoStore = useSeoStore()
const { initEditor, destroyEditor } = useEditor()
const { analyzeSeo } = useSeo()

onMounted(() => {
  initEditor()

  // Auto-save every 30 seconds
  const autoSaveInterval = setInterval(() => {
    editorStore.saveContent()
  }, 30000)

  // Clean up on unmount
  onBeforeUnmount(() => {
    clearInterval(autoSaveInterval)
    destroyEditor()
  })
})

// Watch editor content and analyze SEO when content changes
editorStore.$subscribe((mutation, state) => {
  if (mutation.type === MutationType.direct) {
    analyzeSeo(state.content)
  }
})
</script>

<template>
  <div class="blog-editor-container h-screen flex flex-col">
    <EditorTopBar />
    <div class="flex-1 flex overflow-hidden">
      <EditorSidebar />
      <main class="flex-1 overflow-auto p-6">
        <div class="max-w-4xl mx-auto bg-base-200 shadow-md rounded-lg">
          <EditorContent />
        </div>
      </main>
      <SeoPanel />
    </div>
  </div>
</template>
