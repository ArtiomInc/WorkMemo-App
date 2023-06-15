<script lang="ts">
import draggable from "vuedraggable";
import DialogConfirm from "../components/DialogConfirm.vue";
import DialogColor from "../components/DialogColor.vue";
import DialogError from "../components/DialogError.vue";
export default {
  components: {
    draggable,
    DialogConfirm,
    DialogColor,
    DialogError,
  },
  data() {
    return {
      listTodo: null,
      triggerDialogConfirm: false,
      selectedID: -1,
      triggerDialogColor: false,
      triggerDialogError: false,
      contentDialogError: "An error occurred",
      drag: false,
    };
  },
  methods: {
    openDialog() {},
    getTodo() {
      window.electronAPI
        .setCommand(["getTodo"])
        .then((result: any) => {
          this.listTodo = result;
        })
        .catch((error: any) => {
          this.contentDialogError = error;
          this.triggerDialogError = true;
        });
    },
    addTodo() {
      window.electronAPI
        .setCommand(["addTodo"])
        .then((result: any) => {
          this.getTodo();
        })
        .catch((error: any) => {
          this.contentDialogError = error;
          this.triggerDialogError = true;
        });
    },
    updateTodo(id: number) {
      window.electronAPI
        .setCommand([
          "updateTodo",
          id,
          //@ts-ignore
          JSON.parse(JSON.stringify(this.listTodo[id])),
        ])
        .then((result: any) => {})
        .catch((error: any) => {
          this.contentDialogError = error;
          this.triggerDialogError = true;
        });
    },
    updateAllTodo() {
      window.electronAPI
        .setCommand([
          "updateAllTodo",
          //@ts-ignore
          JSON.parse(JSON.stringify(this.listTodo)),
        ])
        .then((result: any) => {})
        .catch((error: any) => {
          this.contentDialogError = error;
          this.triggerDialogError = true;
        });
    },
    colorRequest(id: number) {
      this.selectedID = id;
      this.triggerDialogColor = true;
    },
    updateColor(color: string) {
      if (color != "") {
        //@ts-ignore
        this.listTodo[this.selectedID].color = color;
        this.updateTodo(this.selectedID);
      }
      this.selectedID = -1;
      this.triggerDialogColor = false;
    },
    deleteRequest(id: number) {
      this.selectedID = id;
      this.triggerDialogConfirm = true;
    },
    deleteTodo(payload: boolean) {
      this.triggerDialogConfirm = false;
      if (payload) {
        window.electronAPI
          .setCommand(["deleteTodo", this.selectedID])
          .then((result: any) => {
            this.getTodo();
          })
          .catch((error: any) => {
            this.contentDialogError = error;
            this.triggerDialogError = true;
          });
      }
      this.selectedID = -1;
    },
    releaseDialogError() {
      this.triggerDialogError = false;
      this.contentDialogError = "An error occurred";
    },
  },
  mounted() {
    this.getTodo();
  },
};
</script>

<template>
  <div class="card">
    <draggable
      v-if="listTodo != null"
      :list="listTodo"
      @end="updateAllTodo"
      item-key="id"
    >
      <template #item="{ index, element }">
        <div class="todo">
          <input
            class="input-very-custom"
            v-model="element.content"
            @input="updateTodo(index)"
            @focus="
              //@ts-ignore
              $event.target.select()
            "
            :style="{
              'background-color': element.color,
            }"
          />
          <button class="button button-custom" @click="colorRequest(index)">
            <img src="/images/paint-roller-solid.svg" />
          </button>
          <button class="button button-custom" @click="deleteRequest(index)">
            <img src="/images/trash-can-solid.svg" />
          </button>
        </div>
      </template>
    </draggable>
    <button class="button is-fullwidth" @click="addTodo">Add todo</button>
  </div>

  <DialogConfirm
    v-if="triggerDialogConfirm"
    title="Delete todo ?"
    content="Are you sure you want to delete this todo ?<br/>Impossible to recover after delete"
    @user-action="deleteTodo"
  ></DialogConfirm>
  <DialogColor v-if="triggerDialogColor" @user-action="updateColor">
  </DialogColor>
  <DialogError
    v-if="triggerDialogError"
    :content="contentDialogError"
    @user-action="releaseDialogError()"
  ></DialogError>
</template>

<style scoped>
.todo {
  margin: 0 0 7px 0;
  display: flex;
  align-items: center;
}
.input-very-custom {
  color: var(--color-text);
  border: none;
  border-radius: 5px;
  outline: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.4em 0.4em;
  margin: 0;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 100%;
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
  filter: var(--color-img);
}
.span {
  width: 100%;
  padding-left: 0.4em;
}
</style>
