<script lang="ts">
import { mapMutations } from "vuex";
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  mounted() {
    this.$router.push("/");
    this.darkMode = false;
    if (this.darkMode) {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  },
  data() {
    return {
      root: document.documentElement,
      darkMode: false,
    };
  },
  methods: {
    ...mapMutations(["DarkMode"]),
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.DarkMode(this.darkMode);
      if (this.darkMode) {
        this.setDarkMode();
      } else {
        this.setLightMode();
      }
    },
    setDarkMode() {
      this.root.style.setProperty("--background", "#29282d");
      this.root.style.setProperty("--color-text", "rgba(255,255,255,0.87)");
      this.root.style.setProperty(
        "--color-img",
        "invert(99%) sepia(10%) saturate(436%) hue-rotate(352deg) brightness(112%) contrast(100%)"
      );
      this.root.style.setProperty("--color-card", "#1f1e24");
      this.root.style.setProperty(
        "--shadow-card",
        "0px 1px 3px 0px rgba(0, 0, 0, 0.5)"
      );
      this.root.style.setProperty("--color-button", "#333238");
      this.root.style.setProperty("--color-button-hover", "#2e2d33");
      this.root.style.setProperty("--color-button-disabled", "#fafbfc");
      this.root.style.setProperty("--color-button-active", "#2e2d33");
      this.root.style.setProperty(
        "--color-button-text",
        "rgb(255, 255, 255, 0.8)"
      );
      this.root.style.setProperty(
        "--shadow-button",
        "0px 0px 2px 0px rgba(255, 255, 255, 0.4)"
      );
    },
    setLightMode() {
      this.root.style.setProperty("--background", "#f5f5f5");
      this.root.style.setProperty("--color-text", "rgba(0,0,0,0.87)");
      this.root.style.setProperty(
        "--color-img",
        "invert(0%) sepia(100%) saturate(10%) hue-rotate(212deg) brightness(97%) contrast(103%)"
      );
      this.root.style.setProperty("--color-card", "#fff");
      this.root.style.setProperty(
        "--shadow-card",
        "0px 1px 3px 0px rgba(0, 0, 0, 0.5)"
      );
      this.root.style.setProperty("--color-button", "#fafbfc");
      this.root.style.setProperty("--color-button-hover", "#f3f4f6");
      this.root.style.setProperty("--color-button-disabled", "#dcdcdc");
      this.root.style.setProperty("--color-button-active", "#edeff2");
      this.root.style.setProperty("--color-button-text", "rgb(0, 0, 0, 0.8)");
      this.root.style.setProperty(
        "--shadow-button",
        "0px 0px 2px 0px rgba(0, 0, 0, 0.4)"
      );
    },
  },
};
</script>

<template>
  <NavBar @user-action="toggleDarkMode"></NavBar>
  <router-view></router-view>
</template>

<style scoped></style>
