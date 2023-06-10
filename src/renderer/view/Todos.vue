<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDialogReturn"]),
  },
  data() {
    return {
      listTodo: null,
      apiResponse: null,
      checkingEndOfDialog: 0,
      deleteIdTodo: -1,
    };
  },
  methods: {
    ...mapMutations([
      "setDialogTrigger",
      "setDialogTitle",
      "setDialogContent",
      "setDialogReturn",
    ]),
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
    deleteRequest(id: number) {
      this.deleteIdTodo = id;
      this.setDialogTrigger(true);
      this.setDialogTitle("Delete todo ?");
      this.setDialogContent(
        "Are you sure you want to delete this todo ? </br>Once deleted, it will be impossible to recover."
      );
      this.checkingEndOfDialog = setInterval(() => {
        if (this.getDialogReturn === "cancelled") {
          console.log(this.getDialogReturn);
          this.setDialogReturn("");
          clearInterval(this.checkingEndOfDialog);
        } else if (this.getDialogReturn === "deleted") {
          console.log(this.getDialogReturn);
          this.setDialogReturn("");
          this.deleteTodo(this.deleteIdTodo);
          clearInterval(this.checkingEndOfDialog);
        }
        const read = this.getDialogReturn;
      }, 100);
    },
    deleteTodo(id: number) {
      window.electronAPI
        .setCommand(["deleteTodo", id])
        .then((result: any) => {
          this.deleteIdTodo = -1;
          this.getTodo();
        })
        .catch((error: any) => {
          this.deleteIdTodo = -1;
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
      <button class="button button-custom" @click="deleteRequest(index)">
        <img src="/images/trash-can-solid.svg" />
      </button>
    </div>
    <button class="button is-fullwidth" @click="addTodo">Add</button>
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
