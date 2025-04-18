<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { EditorContent, Editor, type AnyExtension, useEditor } from '@tiptap/vue-3'
import { extensions, YoutubeModal, LinkModal, ImageModal } from '@/components'
import { post } from '@/stores'

const characterCount = ref(0)

// Editor state
const editor = useEditor({
  extensions,
  content: post.content,
  onUpdate: ({ editor }) => {
    post.content = editor.getHTML()
    characterCount.value = editor.storage.characterCount.characters()
  },
  onTransaction: () => {
    editor.value = editor.value
  },
})
// Cleanup editor
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div class="editor-container relative">
    <div v-if="editor" class="character-count mb-2 text-sm text-gray-500">
      Characters: {{ characterCount }}
    </div>
    <div class="toolbar mb-4 flex gap-2">
      <!-- <button v-for="command in commands" :key="command.title" class="btn btn-sm" -->
      <!--   :class="{ 'btn-primary': editor?.isActive(command.title.toLowerCase()) }" -->
      <!--   @click="command.command({ editor! })"> -->
      <!--   {{ command.title }} -->
      <!-- </button> -->
    </div>
    <!-- <bubble-menu class="bubble-menu" :editor="editor as any" :tippy-options="{ duration: 100 }" v-if="editor"> -->
    <!--   <div class="bubble-menu"> -->
    <!--     <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"> -->
    <!--       Bold -->
    <!--     </button> -->
    <!--     <button @click="editor.chain().focus().toggleItalic().run()" -->
    <!--       :class="{ 'is-active': editor.isActive('italic') }"> -->
    <!--       Italic -->
    <!--     </button> -->
    <!--     <button @click="editor.chain().focus().toggleStrike().run()" -->
    <!--       :class="{ 'is-active': editor.isActive('strike') }"> -->
    <!--       Strike -->
    <!--     </button> -->
    <!--   </div> -->
    <!-- </bubble-menu> -->
    <EditorContent :editor="editor" />
    <!-- <div ref="editorElement" class="prose min-h-[500px] max-w-none border rounded p-4"></div> -->
    <div v-if="editor" class="editor-info mt-2 text-sm text-gray-500">
      <span>Type <kbd>/</kbd> for commands</span> |
      <span>Use <kbd>Tab</kbd> to select highlighted command</span>
    </div>

    <!-- Modals -->
    <LinkModal :editor="editor!" />
    <YoutubeModal :editor="editor!" />
    <ImageModal :editor="editor!" />
  </div>
</template>

<style lang="scss">
.editor-container {
  width: 1200px;
}

.prose :global(img) {
  cursor: move;
  transition: transform 0.2s ease;
}

.prose :global(img):hover {
  transform: scale(1.02);
}

.prose :global(.dropcursor) {
  border-radius: 0.25rem;
}

.prose :global(.focus-ring) {
  border-radius: 0.25rem;
  box-shadow: 0 0 0 2px rgba(149, 141, 241, 0.4);
}

/* Bubble menu */
.bubble-menu {
  background-color: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  padding: 0.2rem;

  button {
    background-color: unset;

    &:hover {
      background-color: var(--gray-3);
    }

    &.is-active {
      background-color: var(--purple);

      &:hover {
        background-color: var(--purple-contrast);
      }
    }
  }
}

kbd {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}
</style>
