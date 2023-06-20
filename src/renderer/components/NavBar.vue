<script lang="ts">
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["DarkMode"]),
  },
  emits: {
    userAction: null,
  },
};
</script>

<template>
  <div
    class="bg-white m-2 p-3 rounded-lg flex items-center"
    style="width: calc(100vw - 1rem)"
  >
    <div class="h-14 aspect-square mr-5">
      <img
        src="/images/a_dot_white_logo_logo_black_rounded.png"
        alt="Asyril logo"
        @click="$emit('userAction')"
      />
    </div>
    <router-link
      to="/"
      class="flex items-center h-14 ml-2 px-5 rounded-lg hover:bg-gray-300"
      v-bind:class="{ 'is-active': $route.fullPath === '/' }"
    >
      <img class="h-7" src="/images/list-solid.svg" alt="Todos" />
      <span class="ml-3">Todos</span>
    </router-link>
    <router-link
      to="/notes"
      class="flex items-center h-14 ml-2 px-5 rounded-lg hover:bg-gray-300"
      v-bind:class="{ 'is-active': $route.fullPath === '/notes' }"
    >
      <img class="h-7" src="/images/note-sticky-solid.svg" alt="Notes" />
      <span class="ml-3">Notes</span>
    </router-link>
  </div>
</template>

<style scoped></style>
