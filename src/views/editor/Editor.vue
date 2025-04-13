<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Suggestion from '@tiptap/suggestion'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import * as lowlight from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import Details from './Details.vue'

lowlight.all.registerLanguage('javascript', javascript)

const commands = [
  { title: 'Bold', command: () => editor.value?.chain().focus().toggleBold().run() },
  { title: 'Italic', command: () => editor.value?.chain().focus().toggleItalic().run() },
  {
    title: 'Image',
    command: () =>
      editor.value
        ?.chain()
        .focus()
        .insertContent({ type: 'image', attrs: { src: 'image-url' } })
        .run(),
  },
  {
    title: 'Link',
    command: () => editor.value?.chain().focus().toggleLink({ href: 'link-url' }).run(),
  },
  { title: 'Code Block', command: () => editor.value?.chain().focus().toggleCodeBlock().run() },
  // Add more commands as needed
]

const editor = ref(null)
editor.value = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Suggestion.configure({
      editor: editor.value,
      startOfLine: '/',
      items: ({ query }) => {
        return commands.filter((command) =>
          command.title.toLowerCase().startsWith(query.toLowerCase()),
        )
      },
      onEnter: ({ editor, range, props }) => {
        const { command } = props.item
        command()
        editor.chain().focus().deleteRange(range).run()
      },
    }),
  ],
})
</script>

<template>
  <div class="flex gap-8">
    <div class="flex-1">
      <EditorContent :editor="editor" />
    </div>
    <div class="w-1/3">
      <Details />
    </div>
  </div>
</template>
