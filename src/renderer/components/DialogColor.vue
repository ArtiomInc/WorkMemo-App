<script lang="ts">
export default {
  emits: {
    userAction: null,
  },
  methods: {
    Cancel() {
      this.$emit("userAction", "");
    },
    setColor(uuid: String) {
      this.$emit("userAction", uuid);
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
          <div
            class="color red"
            style="background-color: #ff5252"
            @click="setColor('rgba(255, 82, 82, 0.5)')"
          ></div>
          <div
            class="color blue"
            style="background-color: #448aff"
            @click="setColor('rgba(68, 138, 255, 0.5)')"
          ></div>
          <div
            class="color green"
            style="background-color: #66bb6a"
            @click="setColor('rgba(102, 187, 106, 0.5)')"
          ></div>
          <div class="color default" @click="setColor('rgba(0,0,0,0)')"></div>
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
  z-index: 1000;
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
.color.default {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
}
.color.blue:hover,
.color.green:hover,
.color.red:hover,
.color.default:hover {
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
