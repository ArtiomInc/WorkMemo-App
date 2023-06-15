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
  <div class="card">
    <div class="logo">
      <img
        v-if="!DarkMode"
        src="/images/a_dot_white_logo_logo_black_rounded.png"
        alt="Asyril logo"
        @click="$emit('userAction')"
      />
      <img
        v-if="DarkMode"
        src="/images/a_dot_black_logo_white_rounded.png"
        alt="Asyril logo"
        @click="$emit('userAction')"
      />
    </div>

    <router-link
      to="/"
      class="tab"
      v-bind:class="{ 'is-active': $route.fullPath === '/' }"
    >
      <img src="/images/list-solid.svg" />
      Todos</router-link
    >
    <router-link
      to="/notes"
      class="tab"
      v-bind:class="{ 'is-active': $route.fullPath === '/notes' }"
    >
      <img src="/images/note-sticky-solid.svg" />
      Notes</router-link
    >
    <div class="emptyspace"></div>
  </div>
</template>

<style scoped>
.card {
  height: 58px;
  width: calc(100% - 50px);
  display: flex;
  align-items: center;
}
.logo > img {
  height: 58px;
}
a > img {
  height: 20px;
  margin-right: 12px;
  filter: var(--color-img);
}
.theme > img {
  height: 30px;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  padding: 25px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 5px;
}
.tab:hover:not(.is-active) {
  cursor: pointer;
  background: var(--background);
}
.is-active {
  background: var(--background);
}
.emptyspace {
  width: 100%;
}
.theme {
  display: flex;
  align-items: center;
  cursor: pointer;
}

@media screen and (max-width: 700px) {
  .card {
    display: block;
    height: 100%;
  }
  .logo {
    height: 58px;
    margin: auto;
  }
  .tab {
    justify-content: center;
    margin-left: 0px;
    margin-top: 10px;
  }
}
</style>
