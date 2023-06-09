<script lang="ts">
import { mapGetters } from "vuex";
import NavBar from "./components/NavBar.vue";
import Dialog from "./components/Dialog.vue";

export default {
  components: {
    NavBar,
    Dialog,
  },
  computed: {
    ...mapGetters(["getDialogTrigger"]),
  },
};
</script>

<template>
  <NavBar></NavBar>
  <router-view class="router-view"></router-view>
  <Dialog v-if="getDialogTrigger"></Dialog>
</template>

<style scoped></style>
