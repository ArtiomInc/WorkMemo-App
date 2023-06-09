<script lang="ts">
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      apiResponse: null,
      count: 0,
      loadingSave: false,
    };
  },
  mounted() {
    window.electronAPI
      .setCommand("String")
      .then((result: any) => {
        this.apiResponse = result;
      })
      .catch((error: any) => {
        this.apiResponse = error;
        this.setDialogTrigger(true);
        this.setDialogTitle("Error from ElectronAPI");
        this.setDialogContent(error);
      });
  },
  methods: {
    ...mapMutations(["setDialogTrigger", "setDialogTitle", "setDialogContent"]),
    openDialog() {},
    loadingTest() {
      this.loadingSave = !this.loadingSave;
    },
  },
};
</script>

<template>
  <div class="view">
    <div class="card card-custom">
      <div class="content">
        <h2 class="system-state-label">System state</h2>
        <h2 class="system-state-value">{{ apiResponse }}</h2>
      </div>
    </div>
    <div class="card">
      <div class="content">
        <h2>There is button template counter</h2>
        <button class="button" type="button" @click="count++">
          count is {{ count }}
        </button>
      </div>

      <div class="content">
        <h2>There is loading button template</h2>
        <button
          class="button is-fullwidth"
          type="button"
          @click="loadingTest"
          :disabled="loadingSave"
        >
          <div>Save</div>
          <span v-if="loadingSave" class="loader"></span>
        </button>
        <button class="button is-fullwidth" @click="loadingTest">Reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-custom {
  margin-top: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.system-state-label {
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 10px;
}
.system-state-value {
  font-size: 1.5em;
  font-weight: 700;
}

.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #999;
  border-bottom-color: transparent;
  border-radius: 50%;
  margin: 0 7px 0 7px;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
