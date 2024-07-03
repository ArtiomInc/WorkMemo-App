<template>
  <div
    v-if="state"
    class="animate-fade-in fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 p-5 dark:bg-white/25"
  >
    <div class="animate-slide-up mt-20 flex items-start justify-center">
      <div class="card">
        <h1 class="text-lg font-bold">Delete ?</h1>
        <span v-html="message" />
        <div class="mt-2 flex justify-end gap-1">
          <button class="btn error" @click="deleteAction">Delete</button>
          <button class="btn secondary" @click="cancelAction">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useDeleteStore } from '../stores/DialogDelete'

const deleteStore = useDeleteStore()
const state = computed(() => deleteStore.deleteState)
const message = computed(() => deleteStore.deleteMessage)

const cancelAction = () => {
  deleteStore.setDeleteLastResult(false)
  deleteStore.setDeleteState(false, '')
}
const deleteAction = () => {
  deleteStore.setDeleteLastResult(true)
  deleteStore.setDeleteState(false, '')
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.2s ease-out;
}
</style>
