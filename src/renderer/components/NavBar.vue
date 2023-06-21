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
    class="bg-white dark:bg-black m-2 p-3 rounded-lg md:flex items-center drop-shadow"
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
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-neutral-200 select-none"
      :class="{ 'bg-neutral-300': $route.fullPath === '/' }"
    >
      <img class="h-7" src="/images/list-solid.svg" alt="Todos" />
      <span class="ml-3">Todos</span>
    </router-link>
    <router-link
      to="/notes"
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-neutral-200 active select-none"
      :class="{ 'bg-neutral-300': $route.fullPath === '/notes' }"
    >
      <img class="h-7" src="/images/note-sticky-solid.svg" alt="Notes" />
      <span class="ml-3">Notes</span>
    </router-link>
  </div>
</template>

<style scoped></style>
