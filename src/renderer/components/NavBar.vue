<script lang="ts" setup>
import { ListTodo, NotebookPen } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

import AppCommands from '../../main/static/AppCommands'
import Modal from './ui/Modal.vue'

const error = ref('')

onMounted(async () => {
  getTheme()
  getVersion()
})

const theme = ref('')
const version = ref('')

const getTheme = () => {
  window.electronAPI
    .setCommand([AppCommands.GET_THEME])
    .then((result: any) => {
      theme.value = result
      if (theme.value === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      } else {
        document.documentElement.classList.add('dark')
        document.documentElement.style.colorScheme = 'dark'
      }
    })
    .catch((e: any) => {
      error.value = e.message
    })
}

const saveTheme = () => {
  window.electronAPI
    .setCommand([AppCommands.SAVE_THEME, theme.value])
    .then(() => {})
    .catch((e: any) => {
      error.value = e.message
    })
}

const toggleDarkMode = () => {
  if (theme.value === 'light') {
    theme.value = 'dark'
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  } else {
    theme.value = 'light'
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }
  saveTheme()
}

const getVersion = () => {
  window.electronAPI
    .setCommand([AppCommands.GET_VERSION, theme.value])
    .then((result: any) => {
      version.value = result
    })
    .catch((e: any) => {
      error.value = e.message
    })
}
</script>

<template>
  <div class="card m-2 mb-0 items-center justify-between sm:flex">
    <div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
      <div class="aspect-square h-10 cursor-pointer md:ml-0 md:mr-0" @click="toggleDarkMode">
        <img class="select-none rounded-lg" src="../assets/icon.svg" alt="WorkMemo logo" />
      </div>
      <router-link
        to="/todos"
        class="flex h-10 select-none items-center rounded-lg px-5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        :class="{
          'cursor-default bg-black/10 dark:bg-white/10': $route.fullPath === '/todos'
        }"
      >
        <ListTodo class="text-black dark:text-white" :size="20" />
        <span class="ml-3 dark:text-neutral-200">Todos</span>
      </router-link>
      <router-link
        to="/notes"
        class="flex h-10 select-none items-center rounded-lg px-5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        :class="{
          'cursor-default bg-black/10 dark:bg-white/10': $route.fullPath === '/notes'
        }"
      >
        <NotebookPen class="text-black dark:text-white" :size="20" />
        <span class="ml-3 dark:text-neutral-200">Notes</span>
      </router-link>
    </div>
    <div class="hidden items-center justify-center px-2 font-semibold text-black/20 dark:text-white/20 sm:flex">
      {{ version }}
    </div>
  </div>
  <Modal v-if="error !== ''">
    <p>{{ error }}</p>
    <div class="mt-1 flex">
      <button class="btn secondary w-full" @click="error = ''">Cancel</button>
    </div>
  </Modal>
</template>
