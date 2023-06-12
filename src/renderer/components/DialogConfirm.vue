<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "getDialogConfirmTitle",
      "getDialogConfirmContent",
      "getDialogConfirmReturn",
    ]),
  },
  methods: {
    ...mapMutations(["setDialogConfirmTrigger", "setDialogConfirmReturn"]),
    Cancel() {
      this.setDialogConfirmReturn("cancelled");
      this.setDialogConfirmTrigger(false);
    },
    Delete() {
      this.setDialogConfirmReturn("deleted");
      this.setDialogConfirmTrigger(false);
    },
  },
};
</script>

<template>
  <div class="dialog-bg">
    <div class="dialog-content">
      <div class="card">
        <h1>{{ getDialogConfirmTitle }}</h1>
        <span v-html="getDialogConfirmContent"></span>
        <div class="action-user">
          <button class="button is-fullwidth text-red" @click="Delete">
            Delete
          </button>
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
  z-index: 1;
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
