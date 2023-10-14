<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(async () => {
  localStorage.theme = 'light';
});

const toggleDarkMode = () => {
  if (localStorage.theme === 'light') {
    localStorage.theme = 'dark';
    document.documentElement.classList.add('dark');
  } else {
    localStorage.theme = 'light';
    document.documentElement.classList.remove('dark');
  }
};
</script>

<template>
  <div
    class="bg-white dark:bg-neutral-800 m-2 p-3 rounded-lg md:flex items-center drop-shadow"
    style="width: calc(100% - 1rem)"
  >
    <div
      class="h-14 aspect-square m-auto md:ml-0 md:mr-5 cursor-pointer"
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
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 select-none"
      :class="{
        'bg-black/10 dark:bg-white/10 cursor-default': $route.fullPath === '/',
      }"
    >
      <img class="hidden dark:block h-8" src="../assets/checklist_white.svg" />
      <img class="block dark:hidden h-8" src="../assets/checklist_black.svg" />
      <span class="ml-3 dark:text-neutral-200">Todos</span>
    </router-link>
    <router-link
      to="/notes"
      class="flex items-center h-14 mt-2 md:mt-0 md:ml-2 px-5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 select-none"
      :class="{
        'bg-black/10 dark:bg-white/10 cursor-default':
          $route.fullPath === '/notes',
      }"
    >
      <img class="hidden dark:block h-8" src="../assets/edit_note_white.svg" />
      <img class="block dark:hidden h-8" src="../assets/edit_note_black.svg" />
      <span class="ml-3 dark:text-neutral-200">Notes</span>
    </router-link>
  </div>
</template>
