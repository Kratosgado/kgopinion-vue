<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { useEditorStore } from '../../stores/editorStore'
import { useBlogEditor } from '@/components/editor/useEditor'
import MenuBar from './MenuBar.vue'

const editorStore = useEditorStore()

const { editor } = useBlogEditor()
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
      <input v-model="editorStore.title" class="w-full text-3xl font-bold outline-none input input-xl"
        placeholder="Add Title" />
    </div>

    <MenuBar :editor="editor" />

    <div class="px-6 py-4 min-h-[500px]">
      <!-- <EditorBubbleMenu :editor="editor" /> -->
      <EditorContent :editor="editor" class="prose max-w-none" />
    </div>
  </div>
</template>
