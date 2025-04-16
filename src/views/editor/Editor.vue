<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// import { lowlight } from 'lowlight'
// import javascript from 'highlight.js/lib/languages/javascript'
import { post, extra } from './store'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import { useRouter } from 'vue-router'
import { EditorContent, Editor } from '@tiptap/vue-3'

// Register language for code highlighting
// lowlight.registerLanguage('javascript', javascript)

// Editor state
const editor = ref<Editor | undefined>(undefined)
const characterCount = ref(0)
// const router = useRouter()
//
// // Slash command configuration
// const commands = [
//   {
//     title: 'Heading 1',
//     command: ({ editor }: { editor: Editor }) =>
//       editor.chain().focus().toggleHeading({ level: 1 }).run(),
//   },
//   {
//     title: 'Heading 2',
//     command: ({ editor }: { editor: Editor }) =>
//       editor.chain().focus().toggleHeading({ level: 2 }).run(),
//   },
//   {
//     title: 'Bold',
//     command: ({ editor }: { editor: Editor }) => editor.chain().focus().toggleBold().run(),
//   },
//   {
//     title: 'Italic',
//     command: ({ editor }: { editor: Editor }) => editor.chain().focus().toggleItalic().run(),
//   },
//   {
//     title: 'Bullet List',
//     command: ({ editor }: { editor: Editor }) => editor.chain().focus().toggleBulletList().run(),
//   },
//   {
//     title: 'Ordered List',
//     command: ({ editor }: { editor: Editor }) => editor.chain().focus().toggleOrderedList().run(),
//   },
//   { title: 'Image', command: () => (extra.showImageModal = true) },
//   { title: 'Link', command: () => (extra.showLinkModal = true) },
//   { title: 'YouTube', command: () => (extra.showYoutubeModal = true) },
//   {
//     title: 'Code Block',
//     command: ({ editor }: { editor: Editor }) => editor.chain().focus().toggleCodeBlock().run(),
//   },
// ]

// Initialize editor
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      // Youtube,
      // suggestion({
      //   items: ({ query }: { query: string }) => {
      //     return commands.filter((command) =>
      //       command.title.toLowerCase().startsWith(query.toLowerCase()),
      //     )
      //   },
      //   command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
      //     props.command({ editor })
      //     editor.chain().focus().deleteRange(range).run()
      //   },
      // }),
      BubbleMenu.configure({
        element: document.querySelector('.modal'),
      }),
      // FloatingMenu.configure({
      //   element: document.createElement('div'),
      // }),
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      post.content = editor.getHTML()
      characterCount.value = editor.getText().length
    },
    onTransaction: () => {
      if (editor.value) editor.value = editor.value
    },
  })
})

// Cleanup editor
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

// Toolbar actions
const setLink = (url: string) => {
  if (editor.value) {
    editor.value.chain().focus().setLink({ href: url }).run()
    extra.showLinkModal = false
  }
}

const addImage = (url: string) => {
  if (editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
    extra.showImageModal = false
  }
}

const addYoutube = (url: string) => {
  if (editor.value) {
    // editor.value.chain().focus().setYoutube({ src: url }).run()
    extra.showYoutubeModal = false
  }
}
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
    <bubble-menu class="bubble-menu" :editor="editor as any" :tippy-options="{ duration: 100 }" v-if="editor">
      <div class="bubble-menu">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          Italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          Strike
        </button>
      </div>
    </bubble-menu>
    <EditorContent :editor="editor as any" />
    <!-- <div ref="editorElement" class="prose min-h-[500px] max-w-none border rounded p-4"></div> -->
    <div v-if="editor" class="editor-info mt-2 text-sm text-gray-500">
      <span>Type <kbd>/</kbd> for commands</span> |
      <span>Use <kbd>Tab</kbd> to select highlighted command</span>
    </div>

    <!-- Modals -->
    <div v-if="extra.showLinkModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Insert Link</h3>
        <input v-model="extra.linkText" type="text" placeholder="Enter URL" class="input input-bordered w-full mt-2" />
        <div class="modal-action">
          <button class="btn" @click="extra.showLinkModal = false">Cancel</button>
          <button class="btn btn-primary" @click="setLink(extra.linkText)">Insert</button>
        </div>
      </div>
    </div>

    <div v-if="extra.showImageModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Insert Image</h3>
        <input type="text" placeholder="Enter image URL" class="input input-bordered w-full mt-2"
          @change="(e) => addImage((e.target as HTMLInputElement).value)" />
        <div class="modal-action">
          <button class="btn" @click="extra.showImageModal = false">Cancel</button>
          <button class="btn btn-primary" @click="extra.showImageModal = false">Insert</button>
        </div>
      </div>
    </div>

    <div v-if="extra.showYoutubeModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Insert YouTube Video</h3>
        <input type="text" placeholder="Enter YouTube URL" class="input input-bordered w-full mt-2"
          @change="(e) => addYoutube((e.target as HTMLInputElement).value)" />
        <div class="modal-action">
          <button class="btn" @click="extra.showYoutubeModal = false">Cancel</button>
          <button class="btn btn-primary" @click="extra.showYoutubeModal = false">Insert</button>
        </div>
      </div>
    </div>
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
