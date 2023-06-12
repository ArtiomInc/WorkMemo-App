<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDialogConfirmReturn", "getDialogColorReturn"]),
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
      "setDialogConfirmTrigger",
      "setDialogConfirmTitle",
      "setDialogConfirmContent",
      "setDialogConfirmReturn",
      "setDialogColorTrigger",
      "setDialogColorReturn",
    ]),
    openDialog() {
      this.setDialogConfirmTrigger(true);
      this.setDialogConfirmTitle("Delete todo ?");
      this.setDialogConfirmContent(
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
          this.setDialogConfirmTrigger(true);
          this.setDialogConfirmTitle("Error from ElectronAPI");
          this.setDialogConfirmContent(error);
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
          this.setDialogConfirmTrigger(true);
          this.setDialogConfirmTitle("Error from ElectronAPI");
          this.setDialogConfirmContent(error);
        });
    },
    updateTodoContent(id: number) {
      window.electronAPI
        //@ts-ignore
        .setCommand(["updateTodoContent", id, this.listTodo[id].content])
        .then((result: any) => {})
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogConfirmTrigger(true);
          this.setDialogConfirmTitle("Error from ElectronAPI");
          this.setDialogConfirmContent(error);
        });
    },
    colorRequest(id: number) {
      this.deleteIdTodo = id;
      this.setDialogColorTrigger(true);
      this.checkingEndOfDialog = setInterval(() => {
        if (this.getDialogConfirmReturn === "cancelled") {
          console.log(this.getDialogConfirmReturn);
          this.setDialogConfirmReturn("");
          clearInterval(this.checkingEndOfDialog);
        } else {
          console.log(this.getDialogConfirmReturn);
          clearInterval(this.checkingEndOfDialog);
          this.setDialogColorReturn("");
        }
        const read = this.getDialogConfirmReturn;
      }, 100);
    },
    deleteRequest(id: number) {
      this.deleteIdTodo = id;
      this.setDialogConfirmTrigger(true);
      this.setDialogConfirmTitle("Delete todo ?");
      this.setDialogConfirmContent(
        "Are you sure you want to delete this todo ? </br>Once deleted, it will be impossible to recover."
      );
      this.checkingEndOfDialog = setInterval(() => {
        if (this.getDialogConfirmReturn === "cancelled") {
          console.log(this.getDialogConfirmReturn);
          this.setDialogConfirmReturn("");
          clearInterval(this.checkingEndOfDialog);
        } else if (this.getDialogConfirmReturn === "deleted") {
          console.log(this.getDialogConfirmReturn);
          this.setDialogConfirmReturn("");
          this.deleteTodo(this.deleteIdTodo);
          clearInterval(this.checkingEndOfDialog);
        }
        const read = this.getDialogConfirmReturn;
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
          this.setDialogConfirmTrigger(true);
          this.setDialogConfirmTitle("Error from ElectronAPI");
          this.setDialogConfirmContent(error);
        });
    },
    chooseColor() {
      this.setDialogColorTrigger(true);
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
        class="input-very-custom"
        :style="{
          //@ts-ignore
          color: item.color,
        }"
        v-model="
          //@ts-ignore
          item.content
        "
        @input="updateTodoContent(index)"
        @focus="
          //@ts-ignore
          $event.target.select()
        "
      />
      <button class="button button-custom" @click="chooseColor">
        <img src="/images/paint-roller-solid.svg" />
      </button>
      <button class="button button-custom" @click="deleteRequest(index)">
        <img src="/images/trash-can-solid.svg" />
      </button>
    </div>
    <button class="button is-fullwidth" @click="addTodo">Add todo</button>
  </div>
</template>

<style scoped>
.todo {
  margin: 0 0 7px 0;
  display: flex;
  align-items: center;
}
.input-very-custom {
  border: none;
  border-radius: 5px;
  outline: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.4em 0.4em;
  margin: 0;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #fff;
  width: 100%;
}

.input-very-custom::placeholder {
  color: #ccc;
}

.input-very-custom:hover {
  outline: 1px solid rgba(0, 0, 0, 0.4);
}

.input-very-custom:focus {
  outline: 2px solid rgba(0, 0, 0, 0.5);
}

.input-very-custom.is-fullwidth {
  width: 100%;
}

.button-custom {
  height: 35px;
  width: 35px;
  padding: 0;
  margin-top: 0px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-custom > img {
  height: 50%;
}
.span {
  width: 100%;
  padding-left: 0.4em;
}
</style>
