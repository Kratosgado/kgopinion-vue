<script lang="ts">
	import type { Editor } from '@tiptap/core';
import { extra } from '../../routes/editor/[slug]/extra.svelte';

	let { editor }: { editor: Editor } = $props();
	let youtubeUrl: string | undefined = $state(undefined);

	function insertYoutube() {
		if (youtubeUrl) {
			editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();

			// Reset form
			youtubeUrl = '';
			extra.showYoutubeModal = false;
		}
	}
</script>

<!-- YouTube Modal -->
{#if extra.showYoutubeModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Insert YouTube Video</h3>
			<div class="form-control w-full mt-4">
				<label for="" class="label">
					<span class="label-text">YouTube URL</span>
				</label>
				<input
					type="text"
					bind:value={youtubeUrl}
					placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					class="input input-bordered w-full"
				/>
			</div>
			<div class="modal-action">
				<button class="btn" onclick={() => (extra.showYoutubeModal = false)}>Cancel</button>
				<button class="btn btn-primary" onclick={insertYoutube}>Insert</button>
			</div>
		</div>
	</div>
{/if}
