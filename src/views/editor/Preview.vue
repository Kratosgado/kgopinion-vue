<script setup lang="ts">
import PostView from '../PostView.vue'
import { useEditorStore } from '@/stores/editorStore'

const store = useEditorStore()
</script>

<template>
  <PostView :post="store.getPost" />
</template>
