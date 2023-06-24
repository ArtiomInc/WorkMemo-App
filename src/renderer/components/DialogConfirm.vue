<script lang="ts">
export default {
  props: {
    title: String,
    content: String,
  },
  emits: {
    userAction: null,
  },
  methods: {
    Cancel() {
      this.$emit("userAction", false);
    },
    Delete() {
      this.$emit("userAction", true);
    },
  },
};
</script>

<template>
  <div class="block fixed w-screen h-screen z-50 top-0 left-0 bg-black/50">
    <div class="flex items-start mt-20 justify-center w-screen h-screen">
      <div class="bg-white dark:bg-neutral-800 p-2 rounded-lg drop-shadow">
        <h1 class="text-lg font-bold">{{ title }}</h1>
        <span v-html="content"></span>
        <div class="flex mt-1">
          <button
            class="text-red-500 select-none h-8 px-3 py-1 bg-stone-200 dark:bg-neutral-900 rounded hover:outline hover:outline-2"
            @click="Delete"
          >
            Delete
          </button>
          <button
            class="select-none h-8 mx-2 px-3 py-1 bg-stone-200 dark:bg-neutral-900 rounded hover:outline hover:outline-2"
            @click="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
