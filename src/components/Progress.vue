<script setup lang="ts">
const { value } = defineProps<{ value: number }>()

const scoreBarClass = (score: number) => {
  if (score >= 80) return 'progress-success'
  if (score >= 50) return 'progress-info'
  return 'progress-error'
}
</script>

<template>
  <progress class="progress" :class="scoreBarClass(value)" :value max="100" />
</template>
