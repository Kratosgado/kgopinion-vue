<script setup lang="ts">
const {
  title,
  cb,
  class: color,
} = defineProps<{ title: string; class?: string; cb?: () => void }>()
</script>

<button class="btn {color}" onclick="{cb}">{title}</button>
