<script lang="ts" setup>
import { ListTodo, NotebookPen } from 'lucide-vue-next'
import { onMounted, ref, Ref } from 'vue'

import ipcMainControl from '../../main/static/ipcMainControl'

onMounted(async () => {
  getTheme()
})

const theme: Ref<string> = ref('')

const getTheme = () => {
  window.electronAPI
    .setCommand([ipcMainControl.GET_THEME])
    .then((result: any) => {
      theme.value = result
      document.documentElement.classList.add(theme.value)
    })
    .catch((error: any) => {
      console.log(error)
    })
}

const saveTheme = () => {
  window.electronAPI
    .setCommand([ipcMainControl.SAVE_THEME, theme.value])
    .then((result: any) => {
      console.log(result)
    })
    .catch((error: any) => {
      console.log(error)
    })
}

const toggleDarkMode = () => {
  if (theme.value === 'light') {
    theme.value = 'dark'
    document.documentElement.classList.add('dark')
  } else {
    theme.value = 'light'
    document.documentElement.classList.remove('dark')
  }
  saveTheme()
}
</script>

<template>
  <div
    class="m-2 items-center rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800 md:flex"
    style="width: calc(100% - 1rem)"
  >
    <div class="m-auto aspect-square h-14 cursor-pointer md:ml-0 md:mr-0" @click="toggleDarkMode">
      <img class="select-none rounded-lg" src="../public/images/workmemo-logo.svg" alt="WorkMemo logo" />
    </div>
    <router-link
      to="/"
      class="mt-2 flex h-14 select-none items-center rounded-lg px-5 hover:bg-black/10 dark:hover:bg-white/10 md:ml-2 md:mt-0"
      :class="{
        'cursor-default bg-black/10 dark:bg-white/10': $route.fullPath === '/',
      }"
    >
      <ListTodo class="text-black dark:text-white" :size="20" />
      <span class="ml-3 dark:text-neutral-200">Todos</span>
    </router-link>
    <router-link
      to="/notes"
      class="mt-2 flex h-14 select-none items-center rounded-lg px-5 hover:bg-black/10 dark:hover:bg-white/10 md:ml-2 md:mt-0"
      :class="{
        'cursor-default bg-black/10 dark:bg-white/10': $route.fullPath === '/notes',
      }"
    >
      <NotebookPen class="text-black dark:text-white" :size="20" />
      <span class="ml-3 dark:text-neutral-200">Notes</span>
    </router-link>
  </div>
</template>
