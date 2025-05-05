<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
})

const textColors = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
]

const currentHeading = computed(() => {
  if (props.editor.isActive('heading', { level: 1 })) return 1
  if (props.editor.isActive('heading', { level: 2 })) return 2
  if (props.editor.isActive('heading', { level: 3 })) return 3
  if (props.editor.isActive('heading', { level: 4 })) return 4
  if (props.editor.isActive('heading', { level: 5 })) return 5
  if (props.editor.isActive('heading', { level: 6 })) return 6
  return null
})

const setLink = () => {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // add http:// if it doesn't exist
  const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`

  // update link
  props.editor.chain().focus().extendMarkRange('link').setLink({ href: fullUrl }).run()
}

const addImage = () => {
  const url = window.prompt('Image URL')

  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run()
  }
}

const addVideo = () => {
  const url = window.prompt('YouTube Video URL')

  if (url) {
    props.editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

const insertTable = () => {
  props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const insertDivider = () => {
  props.editor.chain().focus().setHorizontalRule().run()
}

const insertBlockquote = () => {
  props.editor.chain().focus().toggleBlockquote().run()
}

const insertCodeBlock = () => {
  props.editor.chain().focus().toggleCodeBlock().run()
}

const insertSpacer = () => {
  // Custom spacer logic would go here
  props.editor.chain().focus().insertContent('<div class="spacer my-8"></div>').run()
}

const insertButton = () => {
  // Custom button insertion logic
  props.editor.chain().focus().insertContent('<a class="btn btn-primary">Button Text</a>').run()
}

const insertAccordion = () => {
  // Custom accordion insertion logic
  props.editor
    .chain()
    .focus()
    .insertContent(
      `
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">
        Click to open/close
      </div>
      <div class="collapse-content">
        <p>Content goes here</p>
      </div>
    </div>
  `,
    )
    .run()
}

const insertTabs = () => {
  // Custom tabs insertion logic
  props.editor
    .chain()
    .focus()
    .insertContent(
      `
    <div class="tabs">
      <a class="tab tab-lifted tab-active">Tab 1</a>
      <a class="tab tab-lifted">Tab 2</a>
      <a class="tab tab-lifted">Tab 3</a>
    </div>
    <div class="p-4 bg-base-100 rounded-lg">Tab content here</div>
  `,
    )
    .run()
}
</script>
<template>
  <div
    class="editor-menu-bar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10"
  >
    <!-- Basic Text Formatting -->
    <div class="flex space-x-1">
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
      >
        <i class="fas fa-bold">B</i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
      >
        <i class="fas fa-italic">I</i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Underline"
      >
        <i class="fas fa-underline">U</i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
        title="Strike"
      >
        <i class="fas fa-strikethrough"></i>
      </button>
    </div>

    <!-- Text Alignment -->
    <div class="flex space-x-1">
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive({ textAlign: 'left' }) }"
        @click="editor.chain().focus().setTextAlign('left').run()"
        title="Align Left"
      >
        <i class="fas fa-align-left"></i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive({ textAlign: 'center' }) }"
        @click="editor.chain().focus().setTextAlign('center').run()"
        title="Align Center"
      >
        <i class="fas fa-align-center"></i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive({ textAlign: 'right' }) }"
        @click="editor.chain().focus().setTextAlign('right').run()"
        title="Align Right"
      >
        <i class="fas fa-align-right"></i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive({ textAlign: 'justify' }) }"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        title="Justify"
      >
        <i class="fas fa-align-justify"></i>
      </button>
    </div>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- Heading Levels -->
    <div class="dropdown dropdown-hover">
      <label tabindex="0" class="btn btn-sm m-1">
        <span v-if="currentHeading">H{{ currentHeading }}</span>
        <span v-else>Paragraph</span>
      </label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li><a @click="editor.chain().focus().setParagraph().run()">Paragraph</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">Heading 1</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">Heading 2</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">Heading 3</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">Heading 4</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 5 }).run()">Heading 5</a></li>
        <li><a @click="editor.chain().focus().toggleHeading({ level: 6 }).run()">Heading 6</a></li>
      </ul>
    </div>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- Lists -->
    <div class="flex space-x-1">
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
      >
        <i class="fas fa-list-ul"></i>
      </button>
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Numbered List"
      >
        <i class="fas fa-list-ol"></i>
      </button>
    </div>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- Links and Media -->
    <div class="flex space-x-1">
      <button
        class="btn btn-sm"
        :class="{ 'btn-primary': editor.isActive('link') }"
        @click="setLink"
        title="Add Link"
      >
        <i class="fas fa-link"></i>
      </button>
      <button class="btn btn-sm" @click="addImage" title="Add Image">
        <i class="fas fa-image"></i>
      </button>
      <button class="btn btn-sm" @click="addVideo" title="Add Video">
        <i class="fas fa-video"></i>
      </button>
    </div>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- Advanced Features -->
    <div class="dropdown dropdown-hover">
      <label tabindex="0" class="btn btn-sm m-1"> Insert Block </label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li><a @click="insertTable">Table</a></li>
        <li><a @click="insertDivider">Divider</a></li>
        <li><a @click="insertBlockquote">Blockquote</a></li>
        <li><a @click="insertCodeBlock">Code Block</a></li>
        <li><a @click="insertSpacer">Spacer</a></li>
        <li><a @click="insertButton">Button</a></li>
        <li><a @click="insertAccordion">Accordion</a></li>
        <li><a @click="insertTabs">Tabs</a></li>
      </ul>
    </div>

    <!-- Color Picker -->
    <div class="dropdown dropdown-hover">
      <label tabindex="0" class="btn btn-sm m-1">
        <i class="fas fa-palette"></i>
      </label>
      <div tabindex="0" class="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <div class="grid grid-cols-5 gap-1">
          <button
            v-for="color in textColors"
            :key="color"
            class="w-6 h-6 rounded-full"
            :style="{ backgroundColor: color }"
            @click="editor.chain().focus().setColor(color).run()"
          ></button>
        </div>
      </div>
    </div>

    <!-- Undo/Redo -->
    <div class="flex space-x-1 ml-auto">
      <button
        class="btn btn-sm"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        title="Undo"
      >
        <i class="fas fa-undo"></i>
      </button>
      <button
        class="btn btn-sm"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        title="Redo"
      >
        <i class="fas fa-redo"></i>
      </button>
    </div>
  </div>
</template>
