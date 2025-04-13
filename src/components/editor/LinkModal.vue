<script lang="ts">
	import type { Editor } from '@tiptap/core';
import { extra } from '../../routes/editor/[slug]/extra.svelte';

	let { editor }: { editor: Editor } = $props();
	let linkUrl = $state('');
	function insertLink() {
		if (linkUrl) {
			// If text is selected, update the link on that text
			if (editor.state.selection.content().size > 0) {
				editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
			}
			// If no text is selected but linkText is provided, insert new text with link
			else if (extra.linkText) {
				editor.chain().focus().insertContent(`<a href="${linkUrl}">${extra.linkText}</a>`).run();
			}

			// Reset form
			linkUrl = '';
			extra.linkText = '';
			extra.showLinkModal = false;
		}
	}
</script>

<!-- Link Modal -->
{#if extra.showLinkModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Insert Link</h3>
			<div class="form-control w-full mt-4">
				<label for="" class="label">
					<span class="label-text">URL</span>
				</label>
				<input
					type="text"
					bind:value={linkUrl}
					placeholder="https://example.com"
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full mt-2">
				<label for="" class="label">
					<span class="label-text">Text</span>
				</label>
				<input
					type="text"
					bind:value={extra.linkText}
					placeholder="Link text"
					class="input input-bordered w-full"
				/>
			</div>
			<div class="modal-action">
				<button class="btn" onclick={() => (extra.showLinkModal = false)}>Cancel</button>
				<button class="btn btn-primary" onclick={insertLink}>Insert</button>
			</div>
		</div>
	</div>
{/if}
