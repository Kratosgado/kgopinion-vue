<script setup lang="ts">
const { value, cb } = defineProps<{ value: string; cb: (v: string) => void }>()
</script>
<template>
  <div class="badge badge-info badge-soft">
    {{ value }}
    <button @click="cb(value)" class="ml-1 text-gray-500 hover:text-red-500">
      <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="currentColor">
          <rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)"
            fill="currentColor" stroke-width="0"></rect>
          <path
            d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z"
            stroke-width="0" fill="currentColor"></path>
        </g>
      </svg>
    </button>
  </div>
</template>
