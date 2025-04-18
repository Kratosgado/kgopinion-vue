import { Extension } from '@tiptap/vue-3'
import { suggestions } from './suggestions'
import type { TiptapCommandType } from '@/lib'

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: TiptapCommandType) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [suggestions(this.editor as any)]
  },
})
