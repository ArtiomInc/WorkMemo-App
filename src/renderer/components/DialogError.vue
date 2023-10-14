<script lang="ts" setup>
defineProps({
  content: String,
});
</script>

<template>
  <div
    class="block fixed w-screen h-screen z-50 top-0 left-0 bg-black/50 dark:bg-white/25"
  >
    <div class="flex items-start mt-20 justify-center w-screen h-screen">
      <div class="bg-white dark:bg-neutral-800 p-2 rounded-lg drop-shadow">
        <span v-html="content"></span>
        <div class="flex mt-1">
          <button class="btn-primary text w-full" @click="$emit('cancel')">
            Cancel
          </button>
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
