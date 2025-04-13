import { Extension } from '@tiptap/core';
import { suggestions } from './CommandList';

export default Extension.create({
	name: 'slashcommands',

	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({ editor, range, props }) => {
					props.command({ editor, range });
				}
			}
		};
	},

	addProseMirrorPlugins() {
		return [suggestions(this.editor)];
	}
});
