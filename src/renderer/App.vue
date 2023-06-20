<script lang="ts">
import { mapMutations } from "vuex";
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  mounted() {
    this.$router.push("/");
  },
  methods: {
    ...mapMutations(["DarkMode"]),
  },
};
</script>

<template>
  <NavBar @user-action=""></NavBar>
  <router-view></router-view>
</template>

<style scoped></style>
