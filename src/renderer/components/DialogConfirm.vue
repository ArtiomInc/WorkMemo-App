<script lang="ts" setup>
defineProps({
  title: String,
  content: String,
});
</script>

<template>
  <div
    class="block fixed w-screen h-screen z-50 top-0 left-0 bg-black/50 dark:bg-white/25"
  >
    <div class="flex items-start mt-20 justify-center w-screen h-screen">
      <div class="bg-white dark:bg-neutral-800 p-2 rounded-lg drop-shadow">
        <h1 class="text-lg font-bold">{{ title }}</h1>
        <span v-html="content"></span>
        <div class="flex justify-end mt-2">
          <button class="btn-error text mr-1" @click="$emit('delete')">
            Delete
          </button>
          <button class="btn-primary text" @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
