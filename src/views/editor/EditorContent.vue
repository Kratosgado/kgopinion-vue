<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { useEditorStore } from '../../stores/editorStore'
import { useSeoStore } from '../../stores/seoStore'
import { useBlogEditor } from '@/components/editor/useEditor'
import MenuBar from './MenuBar.vue'
// import EditorBubbleMenu from './EditorBubbleMenu.vue'

const editorStore = useEditorStore()
const seoStore = useSeoStore()
const title = ref('')

const { editor } = useBlogEditor()

// Update title in store
const updateTitle = () => {
  editorStore.setTitle(title.value)
  seoStore.updateMetaTitle(title.value)
}

// Watch for title changes from the store
watch(
  () => editorStore.title,
  (newTitle) => {
    title.value = newTitle
  },
)

// // Watch for content changes
// watch(
//   () => editor.value?.getHTML(),
//   (newContent) => {
//     if (newContent) {
//       editorStore.setContent(newContent)
//     }
//   },
//   { deep: true },
// )

onMounted(() => {
  // If we have stored title, use it
  if (editorStore.title) {
    title.value = editorStore.title
  }
})
</script>

<style>
/* Custom TipTap editor styles */
.ProseMirror {
  outline: none;
  min-height: 400px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Add some spacing between blocks */
.ProseMirror>*+* {
  margin-top: 0.75em;
}

/* Placeholder styling */
.ProseMirror p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>

<template>
  <div class="editor-container" v-if="editor">
    <div class="px-4 py-3 border-b border-gray-200">
      <input v-model="title" class="w-full text-3xl font-bold outline-none input input-xl" placeholder="Add Title"
        @input="updateTitle" />
    </div>

    <MenuBar :editor="editor" />

    <div class="px-6 py-4 min-h-[500px]">
      <!-- <EditorBubbleMenu :editor="editor" /> -->
      <EditorContent :editor="editor" class="prose max-w-none" />
    </div>
  </div>
</template>
