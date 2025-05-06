import { Extension } from '@tiptap/vue-3'
import { suggestions } from './suggestions'
import type { TiptapCommandType } from '@/lib/utils/types'

export const SlashCommands = Extension.create({
  name: 'slashcommands',

  addOptions() {
    return {
      suggestion: {
        // char: '/',
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
