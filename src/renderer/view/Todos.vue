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
  <div class="bg-white m-2 p-2 rounded-lg">
    <draggable
      v-if="listTodo != null"
      :list="listTodo"
      @end="updateAllTodo"
      item-key="id"
    >
      <template #item="{ index, element }">
        <div class="flex items-center mb-2">
          <input
            class="w-full p-1 mr-1 focus:outline-0 rounded"
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
          <button
            class="h-8 aspect-square flex items-center justify-center bg-stone-200 p-1 mr-1 rounded hover:outline hover:outline-2"
            @click="colorRequest(index)"
          >
            <img class="h-5" src="/images/paint-roller-solid.svg" />
          </button>
          <button
            class="h-8 aspect-square flex items-center justify-center bg-stone-200 p-1 rounded hover:outline hover:outline-2"
            @click="deleteRequest(index)"
          >
            <img class="h-5" src="/images/trash-can-solid.svg" />
          </button>
        </div>
      </template>
    </draggable>
    <button
      class="bg-stone-200 px-3 py-1 rounded hover:outline hover:outline-2"
      @click="addTodo"
    >
      Add todo
    </button>
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

<style scoped></style>
