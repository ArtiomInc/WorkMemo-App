<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppCommands from '../main/static/AppCommands'
import Modal from './components/ui/Modal.vue'

const router = useRouter()
const error = ref('')

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
    .catch((e: Error) => {
      error.value = e.message
    })
}

const checkBackupStore = () => {
  window.electronAPI
    .setCommand([AppCommands.CHECK_BACKUP])
    .then(() => {})
    .catch((e: Error) => {
      error.value = e.message
    })
}
</script>

<template>
  <router-view />
  <Modal v-if="error !== ''">
    <p>{{ error }}</p>
    <div class="mt-1 flex">
      <button class="btn secondary w-full" @click="error = ''">Cancel</button>
    </div>
  </Modal>
</template>
