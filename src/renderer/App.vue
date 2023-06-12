<script lang="ts">
import { mapGetters } from "vuex";
import NavBar from "./components/NavBar.vue";
import DialogConfirm from "./components/DialogConfirm.vue";
import DialogColor from "./components/DialogColor.vue";

export default {
  components: {
    NavBar,
    DialogConfirm,
    DialogColor,
  },
  computed: {
    ...mapGetters(["getDialogConfirmTrigger", "getDialogColorTrigger"]),
  },
  mounted() {
    this.$router.push("/");
  },
};
</script>

<template>
  <NavBar></NavBar>
  <router-view class="router-view"></router-view>
  <DialogConfirm v-if="getDialogConfirmTrigger"></DialogConfirm>
  <DialogColor v-if="getDialogColorTrigger"></DialogColor>
</template>

<style scoped></style>
