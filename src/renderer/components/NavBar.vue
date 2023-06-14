<script lang="ts">
export default {};
</script>

<template>
  <div class="card">
    <div class="logo">
      <img
        src="/images/a_dot_white_logo_logo_black_rounded.png"
        alt="Asyril logo"
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
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
}
.logo > img {
  height: 58px;
}
a > img {
  height: 20px;
  margin-right: 12px;
}
.theme > img {
  height: 30px;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
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
.is-active {
  background: #dbdbdb;
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
