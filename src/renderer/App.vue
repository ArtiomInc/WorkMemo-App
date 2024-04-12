<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import NavBar from './components/NavBar.vue'

const router = useRouter()

onMounted(() => {
  router.push('/')
})
</script>

<template>
  <NavBar></NavBar>
  <router-view></router-view>
</template>

<style scoped></style>
