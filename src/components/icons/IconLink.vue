<script setup lang="ts">
const { title, link } = defineProps<{ title: string; link: string }>()
</script>

<template>
  <a :href="link" :aria-label="title" target="_blank" class="btn btn-circle btn-outline">
    <slot />
  </a>
</template>
