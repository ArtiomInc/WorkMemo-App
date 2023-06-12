<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDialogColorReturn"]),
  },
  methods: {
    ...mapMutations(["setDialogColorTrigger", "setDialogColorReturn"]),
    Cancel() {
      this.setDialogColorReturn("cancelled");
      this.setDialogColorTrigger(false);
    },
    setColor(color: String) {
      this.setDialogColorReturn(color);
      this.setDialogColorTrigger(false);
    },
  },
};
</script>

<template>
  <div class="dialog-bg">
    <div class="dialog-content">
      <div class="card">
        <h1>Choose color</h1>
        <div class="action-user">
          <div class="color red" @click="setColor('#ff5252')"></div>
          <div class="color blue" @click="setColor('#448aff')"></div>
          <div class="color green" @click="setColor('#66bb6a')"></div>
        </div>
        <button class="button is-fullwidth" @click="Cancel">Cancel</button>
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

.action-user {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.color {
  aspect-ratio: 1;
  height: 35px;
  border-radius: 100%;
  cursor: pointer;
  margin: 3px;
}
.color.red {
  background-color: #ff5252;
}
.color.red:hover {
  outline: 4px solid rgba(0, 0, 0, 0.1);
}
.color.blue {
  background-color: #448aff;
}
.color.blue:hover {
  outline: 4px solid rgba(0, 0, 0, 0.1);
}
.color.green {
  background-color: #66bb6a;
}
.color.green:hover {
  outline: 4px solid rgba(0, 0, 0, 0.1);
}
.input {
  text-align: center;
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
