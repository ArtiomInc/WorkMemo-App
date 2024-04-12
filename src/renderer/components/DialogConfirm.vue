<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})
defineEmits(['delete', 'cancel'])
</script>

<template>
  <div class="fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 dark:bg-white/25">
    <div class="mt-20 flex h-screen w-screen items-start justify-center">
      <div class="rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
        <h1 class="text-lg font-bold">{{ title }}</h1>
        <span v-html="content"></span>
        <div class="mt-2 flex justify-end">
          <button class="btn error text mr-1" @click="$emit('delete')">Delete</button>
          <button class="btn primary text" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
