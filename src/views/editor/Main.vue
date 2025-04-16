<script setup lang="ts">
import { ref } from 'vue'
import Editor from './Editor.vue'
import Details from './Details.vue'
import Preview from './Preview.vue'

const showPreview = ref(false)
</script>

<template>
  <div class="min-h-screen bg-base-300 p-4">
    <!-- TODO: add status  -->
    <div class="flex flex-row justify-center gap-4">
      <template v-if="showPreview">
        <Preview :togglePreview="() => (showPreview = !showPreview)" />
      </template>
      <template v-else>
        <div>
          <Editor />
        </div>
        <Details :toggle-preview="() => (showPreview = !showPreview)" />
      </template>
    </div>
  </div>
</template>
