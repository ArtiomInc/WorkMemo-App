<script lang="ts">
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    ...mapMutations(["setDialogTrigger", "setDialogTitle", "setDialogContent"]),
    openDialog() {
      this.setDialogTrigger(true);
      this.setDialogTitle(this.title);
      this.setDialogContent(this.content);
    },
  },
};
</script>

<template>
  <div class="view">
    <h1 class="router-name">TestDialog.vue</h1>
    <div class="card">
      <div class="content">
        <h2>Ouvrir le dialog</h2>
        <input class="input" type="text" v-model="title" placeholder="Title" />
        <input
          class="input"
          type="text"
          v-model="content"
          placeholder="Content"
        />
        <button class="button" @click="openDialog">Open dialog</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
