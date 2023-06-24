<script lang="ts">
export default {
  mounted() {
    localStorage.theme = "light";
    this.whichMode();
  },
  methods: {
    whichMode() {
      // On page load or when changing themes, best to add inline in `head` to avoid FOUC
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    toggleDarkMode() {
      if (localStorage.theme === "light") {
        // Whenever the user explicitly chooses dark mode
        localStorage.theme = "dark";
      } else {
        // Whenever the user explicitly chooses light mode
        localStorage.theme = "light";
      }
      this.whichMode();
    },
  },
};
</script>

<template>
  <div
    class="bg-white dark:bg-neutral-800 m-2 p-3 rounded-lg md:flex items-center drop-shadow"
    style="width: calc(100% - 1rem)"
  >
    <div
      class="h-14 aspect-square m-auto md:ml-0 md:mr-5"
      @click="toggleDarkMode"
    >
      <img
        class="select-none"
        src="/images/a_dot_white_logo_logo_black_rounded.png"
        alt="Asyril logo"
      />
    </div>
    <router-link
      to="/"
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-900 select-none"
      :class="{ 'bg-neutral-200 dark:bg-neutral-900 cursor-default': $route.fullPath === '/' }"
    >
      <svg class="h-7 w-7 fill-neutral-800 dark:fill-neutral-200" viewBox="0 0 512 512">
        <path
          d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
        />
      </svg>
      <span class="ml-3 dark:text-neutral-200">Todos</span>
    </router-link>
    <router-link
      to="/notes"
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-900 select-none"
      :class="{ 'bg-neutral-200 dark:bg-neutral-900 cursor-default': $route.fullPath === '/notes' }"
    >
      <svg class="h-7 w-7 fill-neutral-800 dark:fill-neutral-200" viewBox="0 0 448 512">
        <path
          d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z"
        />
      </svg>
      <span class="ml-3 dark:text-neutral-200">Notes</span>
    </router-link>
  </div>
</template>

<style scoped></style>
