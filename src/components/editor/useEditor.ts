import { ref, shallowRef } from 'vue'
import { Editor, Node, type AnyExtension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Youtube from '@tiptap/extension-youtube'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Dropcursor from '@tiptap/extension-dropcursor'
import Focus from '@tiptap/extension-focus'
import { useEditorStore } from '@/stores/editorStore'
import { common } from 'lowlight'
const { lowlight } = common

// Custom extension for shortcodes
const Shortcode = Node.create({
  name: 'shortcode',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: 'shortcode',
      },
      attributes: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-shortcode]',
      },
    ]
  },

  renderHTML({ node }) {
    return ['span', { 'data-shortcode': node.attrs.name }, `[${node.attrs.name}]`]
  },
})

// Custom extension for widgets
const Widget = Node.create({
  name: 'widget',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'basic',
      },
      data: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-widget]',
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      { 'data-widget': node.attrs.type, class: 'widget-container' },
      'Widget: ' + node.attrs.type,
    ]
  },
})

export function useEditor() {
  const editorStore = useEditorStore()
  const editor = shallowRef<Editor | undefined>(undefined)
  const isEditorReady = ref(false)

  const initEditor = () => {
    editor.value = new Editor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }) as AnyExtension,
        // Document,
        // Paragraph,
        // Text,
        Underline,
        Link.configure({
          openOnClick: false,
          linkOnPaste: true,
          HTMLAttributes: {
            class: 'text-primary underline',
          },
        }),
        Image.configure({
          allowBase64: true,
          inline: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: 'Start writing your amazing blog post...',
        }),
        // CodeBlockLowlight.configure({
        //   lowlight,
        // }),
        TextStyle,
        Color,
        Highlight,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        Youtube.configure({
          width: 640,
          height: 480,
          controls: true,
        }),
        TaskList,
        TaskItem,
        CharacterCount,
        // Dropcursor,
        Focus.configure({
          className: 'has-focus',
          mode: 'all',
        }),
        Shortcode,
        Widget,
      ],
      content: editorStore.content || 'Hello',
      autofocus: true,
      editable: true,
      injectCSS: true,
      onUpdate: ({ editor }) => {
        editorStore.setContent(editor.getHTML())
      },
      onFocus: () => {
        console.log('Editor focused')
      },
      onBlur: () => {
        console.log('Editor blurred')
      },
    })

    isEditorReady.value = true
  }

  const destroyEditor = () => {
    if (editor.value) {
      editor.value.destroy()
      editor.value = undefined
      isEditorReady.value = false
    }
  }

  const insertTemplate = (template: string) => {
    if (editor.value) {
      editor.value.commands.insertContent(template)
    }
  }

  const insertShortcode = (name: string, attributes = {}) => {
    if (editor.value) {
      editor.value.commands.insertContent({
        type: 'shortcode',
        attrs: {
          name,
          attributes,
        },
      })
    }
  }

  const insertWidget = (type: string, data = {}) => {
    if (editor.value) {
      editor.value.commands.insertContent({
        type: 'widget',
        attrs: {
          type,
          data,
        },
      })
    }
  }

  return {
    editor,
    isEditorReady,
    initEditor,
    destroyEditor,
    insertTemplate,
    insertShortcode,
    insertWidget,
  }
}
