<script lang="ts">
export default {
  props: {
    content: String,
  },
  emits: {
    userAction: null,
  },
  methods: {
    Cancel() {
      this.$emit("userAction");
    },
  },
};
</script>

<template>
  <div class="dialog-bg">
    <div class="dialog-content">
      <div class="card">
        <h2 v-html="content"></h2>
        <div class="action-user">
          <button class="button is-fullwidth" @click="Cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-bg {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: none;
  background-color: rgba(0, 0, 0, 0.5);
  /*backdrop-filter: blur(5px);*/
}
.dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 20px;
}
.card {
  background: #fff;
  animation-name: ScaleTrans;
  animation-duration: 200ms;
}
.card > h1 {
  text-align: center;
}
.button {
  margin-top: 10px;
}
@keyframes ScaleTrans {
  from {
    transform: scale(0, 0);
  }

  to {
    transform: scale(1, 1);
  }
}
</style>
