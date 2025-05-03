<script setup lang="ts">
import { extra } from '@/stores/extra'
import { Editor } from '@tiptap/vue-3'

const { editor } = defineProps<{ editor: Editor }>()

function insertLink() {
  if (extra.linkUrl) {
    // If text is selected, update the link on that text
    if (editor.state.selection.content().size > 0) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: extra.linkUrl }).run()
    }
    // If no text is selected but linkText is provided, insert new text with link
    else if (extra.linkText) {
      editor.chain().focus().insertContent(`<a href="${extra.linkUrl}">${extra.linkText}</a>`).run()
    }
    // Reset form
    extra.linkUrl = ''
    extra.linkText = ''
    extra.showLinkModal = false
  }
}
</script>

<!-- <!-- Link Modal -->
<template>
  <Teleport to="body">
    <div v-if="extra.showLinkModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Insert Link</h3>
        <div class="form-control w-full mt-4">
          <label for="" class="label">
            <span class="label-text">URL</span>
          </label>
          <input type="text" :value="extra.linkUrl" placeholder="https://example.com"
            class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full mt-2">
          <label for="" class="label">
            <span class="label-text">Text</span>
          </label>
          <input type="text" :value="extra.linkText" placeholder="Link text" class="input input-bordered w-full" />
        </div>
        <div class="modal-action">
          <button class="btn" @click="() => (extra.showLinkModal = false)">Cancel</button>
          <button class="btn btn-primary" @click="insertLink">Insert</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
