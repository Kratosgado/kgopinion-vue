import type { TiptapCommandType } from '@/lib'
import { extra } from '@/stores'
import Suggestion from '@tiptap/suggestion'
import type { Editor } from '@tiptap/vue-3'

// Command suggestion configuration
export const suggestions = (editor: Editor) =>
  Suggestion({
    editor: editor,
    char: '/',
    items: ({ query }) => {
      const commands: {
        title: string
        command: ({ editor, range }: TiptapCommandType) => void
      }[] = [
        {
          title: 'Heading 1',
          command: ({ editor, range }: TiptapCommandType) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
          },
        },
        {
          title: 'Link',
          command({ editor }) {
            const { from, to } = editor.state.selection
            extra.linkText = editor.state.doc.textBetween(from, to, ' ')
            extra.showLinkModal = true
          },
        },
        {
          title: 'Youtube',
          command() {
            extra.showYoutubeModal = true
          },
        },
        {
          title: 'Image',
          command() {
            extra.showImageModal = true
          },
        },
        {
          title: 'Heading 2',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
          },
        },
        {
          title: 'Heading 3',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
          },
        },
        {
          title: 'Bullet List',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
          },
        },
        {
          title: 'Numbered List',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
          },
        },
        {
          title: 'Task List',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
          },
        },
        {
          title: 'Code Block',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
          },
        },
        {
          title: 'Blockquote',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
          },
        },
        {
          title: 'Horizontal Rule',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
          },
        },
        {
          title: 'Table',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3 }).run()
          },
        },
        {
          title: 'Mathematics',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertMathInline().run()
          },
        },
        {
          title: 'Emoji',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertEmoji({ emoji: '😀' }).run()
          },
        },
        {
          title: 'Details',
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertDetails().run()
          },
        },
      ]

      return commands.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    },
    render: () => {
      let popup: HTMLUListElement
      let items: HTMLLIElement[]
      let selectedIndex = 0

      const onKeyDown = (event: KeyboardEvent) => {
        console.info(event.key)
        if (event.key === 'ArrowUp') {
          selectedIndex = (selectedIndex - 1 + items.length) % items.length
          updateSelection()
          event.preventDefault()
        }

        if (event.key === 'ArrowDown') {
          selectedIndex = (selectedIndex + 1) % items.length
          updateSelection()
          event.preventDefault()
        }

        if (event.key === 'Tab') {
          items[selectedIndex]?.click()
          event.preventDefault()
        }
      }

      const updateSelection = () => {
        items.forEach((item, index) => {
          const a = item.getElementsByTagName('a')
          if (index === selectedIndex) {
            a[0].classList.add('focus')
          } else {
            a[0].classList.remove('focus')
          }
        })
      }

      return {
        onStart: (props) => {
          popup = document.createElement('ul')
          popup.classList.add(
            'absolute',
            'z-50',
            'menu',
            'bg-base-200',
            'rounded-box',
            'w-56',
            'shadow-xl',
            'rounded-md',
          )
          popup.style.minWidth = '180px'

          items = props.items.map((item, index) => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.textContent = item.title
            // button.textContent = item.title;
            li.addEventListener('click', () => {
              item.command(props)
              props.editor.commands.focus()
            })

            if (index === selectedIndex) {
              a.classList.add('focus')
            }

            li.appendChild(a)
            return li
          })

          items.forEach((item) => popup.appendChild(item))

          document.body.appendChild(popup)

          const { left, bottom } = props.clientRect()
          popup.style.left = `${left}px`
          popup.style.top = `${bottom}px`

          document.addEventListener('keydown', onKeyDown)
        },

        onUpdate: (props) => {
          const { left, bottom } = props.clientRect()
          popup.style.left = `${left}px`
          popup.style.top = `${bottom}px`

          // Update items
          while (popup.firstChild) {
            popup.removeChild(popup.firstChild)
          }

          items = props.items.map((item, index) => {
            const li = document.createElement('li')
            li.addEventListener('click', () => {
              item.command(props)
              props.editor.commands.focus()
            })

            const a = document.createElement('a')
            a.textContent = item.title
            if (index === selectedIndex) {
              a.classList.add('focus')
            }
            li.appendChild(a)

            return li
          })

          items.forEach((item) => popup.appendChild(item))
        },

        onKeyDown: (props) => {
          if (props.event.key === 'Escape') {
            props.event.preventDefault()
            return true
          }

          return false
        },

        onExit: () => {
          popup.remove()
          document.removeEventListener('keydown', onKeyDown)
        },
      }
    },
  })
