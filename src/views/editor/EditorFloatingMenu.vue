<template>
  <FloatingMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }">
    <div class="bg-white rounded-md shadow-lg p-2 flex border border-gray-200">
      <button class="p-2 rounded hover:bg-gray-100" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 2 }) }">
        <i class="fas fa-heading"></i>
      </button>

      <button class="p-2 rounded hover:bg-gray-100" @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary text-white': editor.isActive('bulletList') }">
        <i class="fas fa-list-ul"></i>
      </button>

      <button class="p-2 rounded hover:bg-gray-100" @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-primary text-white': editor.isActive('orderedList') }">
        <i class="fas fa-list-ol"></i>
      </button>

      <button class="p-2 rounded hover:bg-gray-100" @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-primary text-white': editor.isActive('blockquote') }">
        <i class="fas fa-quote-right"></i>
      </button>

      <button class="p-2 rounded hover:bg-gray-100" @click="editor.chain().focus().setHorizontalRule().run()">
        <i class="fas fa-minus"></i>
      </button>

      <button class="p-2 rounded hover:bg-gray-100" @click="addImage">
        <i class="fas fa-image"></i>
      </button>
    </div>
  </FloatingMenu>
</template>

<script setup lang="ts">
import { FloatingMenu } from '@tiptap/vue-3'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
})

const addImage = () => {
  const url = window.prompt('Image URL')

  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run()
  }
}
</script>
