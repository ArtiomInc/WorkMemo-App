<script lang="ts">
export default {};
</script>

<template>
  <div class="card">
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
.card {
  height: 58px;
  width: calc(100% - 50px);
  background-color: #f5f5f5;
  display: flex;
  min-width: 343px;
}
.logo {
  height: 100%;
}
.tab {
  display: flex;
  place-items: center;
  margin-left: 20px;
  padding: 25px;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  text-decoration: none;
  border-radius: 5px;
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
}
</style>
