<template>
  <div
    v-if="state"
    class="animate-fade-in fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 p-5 dark:bg-white/25"
  >
    <div class="animate-slide-up mt-20 flex items-start justify-center">
      <div class="card">
        <h1 class="text-center text-lg font-bold">Choose color</h1>
        <div class="mb-2 flex">
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-red-400 transition-[outline] duration-100 hover:outline"
            @click="setAction(1)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-green-400 transition-[outline] duration-100 hover:outline"
            @click="setAction(2)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-blue-400 transition-[outline] duration-100 hover:outline"
            @click="setAction(3)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full transition-[outline] duration-100 hover:outline"
            style="background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 1) 100%)"
            @click="setAction(0)"
          ></div>
        </div>
        <button class="btn secondary w-full" @click="cancelAction()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useColorStore } from '../stores/DialogColor'

const colorStore = useColorStore()
const state = computed(() => colorStore.colorState)

const cancelAction = () => {
  colorStore.setColorLastResult(false)
  colorStore.setColorState(false)
}
const setAction = (color: number) => {
  colorStore.setColorLastResult(true)
  colorStore.setColorLastChoice(color)
  colorStore.setColorState(false)
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
