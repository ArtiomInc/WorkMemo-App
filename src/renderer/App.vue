<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppCommands from '../main/static/AppCommands'
import DialogColor from './components/DialogColor.vue'
import DialogDelete from './components/DialogDelete.vue'
import DialogError from './components/DialogError.vue'
import { useErrorStore } from './stores/DialogError'

const router = useRouter()
const errorStore = useErrorStore()

onMounted(() => {
  router.push('/todos')
  getMigrationState()
  checkBackupStore()
})

const getMigrationState = () => {
  window.electronAPI
    .setCommand([AppCommands.GET_MIGRATION_STATE])
    .then((result: number) => {
      if (result === 0 || result === undefined) {
        router.push('/')
      }
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const checkBackupStore = () => {
  window.electronAPI
    .setCommand([AppCommands.CHECK_BACKUP])
    .then(() => {})
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}
</script>

<template>
  <router-view />
  <DialogDelete />
  <DialogColor />
  <DialogError />
</template>

<style scoped></style>
