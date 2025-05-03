<script setup lang="ts">
import { extra } from '@/stores/extra'
import type { Editor } from '@tiptap/core'
import { ref } from 'vue'

let { editor } = defineProps<{ editor: Editor }>()
let youtubeUrl = ref<string | undefined>(undefined)

function insertYoutube() {
  if (youtubeUrl.value) {
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.value }).run()

    // Reset form
    youtubeUrl.value = ''
    extra.showYoutubeModal = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="extra.showYoutubeModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Insert YouTube Video</h3>
        <div class="form-control w-full mt-4">
          <label for="" class="label">
            <span class="label-text">YouTube URL</span>
          </label>
          <input type="text" :value="{ youtubeUrl }" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            class="input input-bordered w-full" />
        </div>
        <div class="modal-action">
          <button class="btn" @click="() => (extra.showYoutubeModal = false)">Cancel</button>
          <button class="btn btn-primary" @click="insertYoutube">Insert</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
