<template>
  <div
    v-if="state"
    class="animate-fade-in fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 p-5 dark:bg-white/25"
  >
    <div class="animate-slide-up mt-20 flex items-start justify-center">
      <div class="rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
        <span v-html="message"></span>
        <div class="mt-1 flex">
          <button class="btn secondary w-full" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useErrorStore } from '../stores/DialogError'

const errorStore = useErrorStore()
const state = computed(() => errorStore.errorState)
const message = computed(() => errorStore.errorMessage)

const cancel = () => {
  errorStore.setErrorState(false, '')
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
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>
