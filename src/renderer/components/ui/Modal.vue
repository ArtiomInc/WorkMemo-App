<template>
  <Teleport to="body">
    <div class="animate-fade-in fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 p-5 dark:bg-white/25">
      <div class="animate-slide-up mt-20 flex max-w-[100vw-2.5rem] items-start justify-center">
        <div class="card">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
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
