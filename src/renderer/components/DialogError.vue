<script lang="ts">
export default {
  props: {
    content: String,
  },
  emits: {
    userAction: null,
  },
  methods: {
    Cancel() {
      this.$emit("userAction");
    },
  },
};
</script>

<template>
  <div class="block fixed w-screen h-screen z-50 top-0 left-0 bg-black/50">
    <div class="flex items-start mt-20 justify-center w-screen h-screen">
      <div class="bg-white p-2 rounded-lg drop-shadow">
        <span v-html="content"></span>
        <div class="flex mt-1">
          <button class="select-none h-8 w-full px-3 py-1 bg-stone-200 rounded hover:outline hover:outline-2" @click="Cancel">Cancel</button>
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
