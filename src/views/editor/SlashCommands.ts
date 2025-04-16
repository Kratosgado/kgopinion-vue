import { Extension } from '@tiptap/core'
import { suggestions } from './CommandList'

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [suggestions(this.editor, ...this.options.suggestions)]
  },
})
