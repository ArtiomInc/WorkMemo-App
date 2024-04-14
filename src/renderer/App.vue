<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DialogColor from './components/DialogColor.vue'
import DialogDelete from './components/DialogDelete.vue'
import DialogError from './components/DialogError.vue'
import NavBar from './components/NavBar.vue'

const router = useRouter()

onMounted(() => {
  router.push('/')
})
</script>

<template>
  <NavBar></NavBar>
  <router-view></router-view>
  <DialogDelete></DialogDelete>
  <DialogColor> </DialogColor>
  <DialogError></DialogError>
</template>

<style scoped></style>
