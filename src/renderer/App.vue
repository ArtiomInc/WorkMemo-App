<script lang="ts">
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  mounted() {
    this.$router.push("/");
  },
};
</script>

<template>
  <NavBar></NavBar>
  <router-view></router-view>
</template>

<style scoped></style>
