<script lang="ts">
export default {};
</script>

<template>
  <div class="navbar">
    <img
      src="/images/a_dot_white_logo_logo_black_rounded.png"
      class="logo"
      alt="Asyril logo"
    />
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
  </div>
</template>

<style scoped>
.navbar {
  height: 58px;
  width: 100%;
  background-color: #f5f5f5;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
}
.logo {
  height: calc(100% - 20px);
  padding: 10px 20px 10px 20px;
}

.tab {
  display: flex;
  place-items: center;
  padding: 1.5em;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  text-decoration: none;
}
.tab:hover:not(.is-active) {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.05);
}
.tab > img {
  height: 20px;
  margin-right: 12px;
}
.is-active {
  background: #dbdbdb;
  border-bottom: 2px solid #000;
  margin-bottom: -2px;
}
</style>
