import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'youtube',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'youtube-video' },
      [
        'iframe',
        mergeAttributes(HTMLAttributes, {
          width: '560',
          height: '315',
          frameborder: '0',
          allowfullscreen: true,
        }),
      ],
    ]
  },

  addNodeView() {
    return ({ node }) => {
      const div = document.createElement('div')
      div.className = 'youtube-video'
      const iframe = document.createElement('iframe')
      iframe.setAttribute('width', '560')
      iframe.setAttribute('height', '315')
      iframe.setAttribute('src', node.attrs.src)
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allowfullscreen', '')
      div.appendChild(iframe)
      return {
        dom: div,
      }
    }
  },

  addCommands() {
    return {
      setYoutube:
        (options: { src: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
