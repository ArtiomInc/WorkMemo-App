<template>
  <div class="h-screen w-screen p-5">
    <div class="flex h-full items-center justify-center rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
      <div class="flex flex-col items-center gap-2 text-center md:max-w-[50%]">
        <h1 class="text-2xl font-bold">Migration of the storing data system</h1>
        <p class="text-lg">
          From the version 2.1.1, the WorkMemo application use a different way to store the data to make them more
          robust.
        </p>
        <p class="text-lg">The data.json file will be imported and stored in store of application.</p>
        <button v-if="isFileLoaded" class="btn secondary" @click="storeTodoData">
          <FolderSync class="text-black dark:text-white" :size="20" />
          Start migration
        </button>
        <span v-else class="h-8" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderSync } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppCommands from '../../main/static/AppCommands'
import { useErrorStore } from '../stores/DialogError'

const errorStore = useErrorStore()
const router = useRouter()
let oldTodoData: any | undefined = undefined
let oldNoteData: any | undefined = undefined

onMounted(() => {
  getDataFile()
})

const isFileLoaded = ref(false)

const getDataFile = () => {
  window.electronAPI
    .setCommand([AppCommands.GET_FILE])
    .then((result: any) => {
      if (result.todo && result.note) {
        isFileLoaded.value = true
        oldTodoData = result.todo
        oldNoteData = result.note
        console.log(result)
      }
    })
    .catch((error: any) => {
      //errorStore.setErrorState(true, error.message)
      console.log(error)
      router.push('/todos')
    })
}

const storeTodoData = () => {
  if (oldTodoData != undefined) {
    window.electronAPI
      .setCommand([AppCommands.MIGRATE_STORE_TODO, oldTodoData])
      .then((result: any) => {
        console.log(result)
        storeNoteData()
      })
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  }
}

const storeNoteData = () => {
  if (oldNoteData != undefined) {
    window.electronAPI
      .setCommand([AppCommands.MIGRATE_STORE_NOTE, oldNoteData])
      .then((result: any) => {
        console.log(result)
        saveMigrationDone()
      })
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  }
}

const saveMigrationDone = () => {
  window.electronAPI
    .setCommand([AppCommands.SAVE_MIGRATION_STATE, 1])
    .then(() => {
      router.push('/todos')
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}
</script>

<style scoped></style>
