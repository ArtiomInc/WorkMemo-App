<script lang="ts" setup>
defineProps({
  content: {
    type: String,
    default: 'Error content',
  },
})
defineEmits(['cancel'])
</script>

<template>
  <div class="fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 dark:bg-white/25">
    <div class="mt-20 flex h-screen w-screen items-start justify-center">
      <div class="rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
        <span v-html="content"></span>
        <div class="mt-1 flex">
          <button class="btn primary text w-full" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ScaleTrans {
  from {
    transform: scale(0, 0);
  }

  to {
    transform: scale(1, 1);
  }
}
</style>
