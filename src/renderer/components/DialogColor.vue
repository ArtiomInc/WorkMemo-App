<template>
  <div class="fixed left-0 top-0 z-50 block h-screen w-screen bg-black/50 dark:bg-white/25">
    <div class="mt-20 flex h-screen w-screen items-start justify-center">
      <div class="rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
        <h1 class="text-center text-lg font-bold">Choose color</h1>
        <div class="mb-2 flex">
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-red-400 hover:outline"
            @click="$emit('userAction', 1)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-green-400 hover:outline"
            @click="$emit('userAction', 2)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-blue-400 hover:outline"
            @click="$emit('userAction', 3)"
          ></div>
          <div
            class="m-1 aspect-square h-8 cursor-pointer rounded-full hover:outline"
            style="background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 1) 100%)"
            @click="$emit('userAction', 0)"
          ></div>
        </div>
        <button class="btn primary text flex w-full justify-center" @click="$emit('cancel')">Cancel</button>
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
