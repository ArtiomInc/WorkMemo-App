<script lang="ts">
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      listTodo: null,
      apiResponse: null,
    };
  },
  methods: {
    ...mapMutations(["setDialogTrigger", "setDialogTitle", "setDialogContent"]),
    openDialog() {
      this.setDialogTrigger(true);
      this.setDialogTitle("Delete todo ?");
      this.setDialogContent(
        "Are you sure you want to delete this todo ?<br/>Impossible to recover after delete"
      );
    },
    getTodo() {
      window.electronAPI
        .setCommand(["getTodo"])
        .then((result: any) => {
          this.listTodo = result;
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from ElectronAPI");
          this.setDialogContent(error);
        });
    },
    addTodo() {
      window.electronAPI
        .setCommand(["addTodo"])
        .then((result: any) => {
          this.getTodo();
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from ElectronAPI");
          this.setDialogContent(error);
        });
    },
    updateTodo(id: number) {
      window.electronAPI
        //@ts-ignore
        .setCommand(["updateTodo", id, this.listTodo[id]])
        .then((result: any) => {})
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from ElectronAPI");
          this.setDialogContent(error);
        });
    },
    deleteTodo(id: number) {
      window.electronAPI
        .setCommand(["deleteTodo", id])
        .then((result: any) => {
          this.getTodo();
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from ElectronAPI");
          this.setDialogContent(error);
        });
    },
  },
  mounted() {
    this.getTodo();
  },
};
</script>

<template>
  <div class="card">
    <div class="todo" v-if="listTodo != null" v-for="(item, index) in listTodo">
      <input
        class="input input-custom"
        v-model="listTodo[index]"
        @input="updateTodo(index)"
      />
      <button class="button button-custom" @click="deleteTodo(index)">
        <img src="/images/trash-can-solid.svg" />
      </button>
    </div>
    <button class="button is-fullwidth" @click="addTodo">Add</button>
    <div>{{ apiResponse }}</div>
  </div>
</template>

<style scoped>
.todo {
  margin: 0 0 7px 0;
  display: flex;
  align-items: center;
}
.input-custom {
  margin: 0px;
  width: 100%;
}
.button-custom {
  height: 35px;
  width: 35px;
  margin-top: 0px;
  margin-left: 10px;
}
.button-custom > img {
  height: 100%;
}
</style>
