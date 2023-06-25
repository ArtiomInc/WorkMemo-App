<script lang="ts">
import DialogConfirm from "../components/DialogConfirm.vue";
import DialogColor from "../components/DialogColor.vue";
import DialogError from "../components/DialogError.vue";
export default {
  components: {
    DialogConfirm,
    DialogColor,
    DialogError,
  },
  data() {
    return {
      listTodo: null,
      selectedID: -1,
      triggerDialogConfirm: false,
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
  <div class="bg-white dark:bg-neutral-800 m-2 p-2 rounded-lg drop-shadow">
    <div v-if="listTodo != null" v-for="(todo, index) in listTodo">
      <div class="flex items-center mb-2">
        <input
          class="w-full p-1 mr-1 focus:outline-0 rounded dark:text-neutral-200"
          v-model="todo.content"
          @input="updateTodo(index)"
          @focus="
            //@ts-ignore
            $event.target.select()
          "
          :style="{
            'background-color': todo.color,
          }"
        />
        <button
          class="select-none h-8 aspect-square flex items-center justify-center bg-stone-200 dark:bg-neutral-900 p-1 mr-1 rounded hover:outline hover:outline-2 dark:outline-neutral-200"
          @click="colorRequest(index)"
        >
          <svg
            class="h-5 fill-neutral-800 dark:fill-neutral-200"
            viewBox="0 0 512 512"
          >
            <path
              d="M0 64C0 28.7 28.7 0 64 0H352c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM160 352c0-17.7 14.3-32 32-32V304c0-44.2 35.8-80 80-80H416c17.7 0 32-14.3 32-32V160 69.5c37.3 13.2 64 48.7 64 90.5v32c0 53-43 96-96 96H272c-8.8 0-16 7.2-16 16v16c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V352z"
            />
          </svg>
        </button>
        <button
          class="select-none h-8 aspect-square flex items-center justify-center bg-stone-200 dark:bg-neutral-900 p-1 rounded hover:outline hover:outline-2 dark:outline-neutral-200"
          @click="deleteRequest(index)"
        >
          <svg
            class="h-5 fill-neutral-800 dark:fill-neutral-200"
            viewBox="0 0 448 512"
          >
            <path
              d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
            />
          </svg>
        </button>
      </div>
    </div>
    <button
      class="select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 px-3 py-1 rounded hover:outline hover:outline-2"
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
