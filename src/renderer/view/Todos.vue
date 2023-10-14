<script lang="ts" setup>
import DialogConfirm from '../components/DialogConfirm.vue';
import DialogColor from '../components/DialogColor.vue';
import DialogError from '../components/DialogError.vue';
import { ipcMainControl } from '../../main/static/ipcMainControl';
import { ref, Ref, onMounted } from 'vue';

let listTodo: Ref<{ content: string; color: number }[]> = ref([]);
let selectedID: Ref<number> = ref(-1);
let triggerDialogConfirm: Ref<boolean> = ref(false);
let triggerDialogColor: Ref<boolean> = ref(false);
let triggerDialogError: Ref<boolean> = ref(false);
let contentDialogError: Ref<string> = ref('An error occurred');
let sortable: Ref<boolean> = ref(false);

const getTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GET])
    .then((result: any) => {
      listTodo.value = result;
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const addTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_ADD])
    .then((result: any) => {
      if (result == null) {
        getTodo();
      } else {
        triggerDialogError.value = true;
        contentDialogError.value = result;
      }
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const updateTodo = (id: number) => {
  window.electronAPI
    .setCommand([
      ipcMainControl.TODO_UPDATE,
      id,
      JSON.parse(JSON.stringify(listTodo.value[id])),
    ])
    .then((result: any) => {
      if (result != null) {
        triggerDialogError.value = true;
        contentDialogError.value = result;
      }
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const shiftTodo = (id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_SHIFT, id, content])
    .then((result: any) => {
      if (result == null) {
        getTodo();
      } else {
        triggerDialogError.value = true;
        contentDialogError.value = result;
      }
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const colorRequest = (id: number) => {
  selectedID.value = id;
  triggerDialogColor.value = true;
};

const updateColor = (color: number) => {
  if (color >= 0) {
    listTodo.value[selectedID.value].color = color;
    updateTodo(selectedID.value);
  }
  selectedID.value = -1;
  triggerDialogColor.value = false;
};

const deleteRequest = (id: number) => {
  selectedID.value = id;
  triggerDialogConfirm.value = true;
};

const deleteTodo = () => {
  triggerDialogConfirm.value = false;
  window.electronAPI
    .setCommand([ipcMainControl.TODO_DELETE, selectedID.value])
    .then((result: any) => {
      if (result == null) {
        getTodo();
      } else {
        triggerDialogError.value = true;
        contentDialogError.value = result;
      }
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
  selectedID.value = -1;
};

const releaseDialogError = () => {
  triggerDialogError.value = false;
  contentDialogError.value = 'An error occurred';
};

onMounted(async () => {
  getTodo();
});
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 m-2 p-2 rounded-lg drop-shadow">
    <div
      v-if="listTodo.length != 0"
      v-for="(todo, index) in listTodo"
      class="mb-2"
    >
      <div
        class="flex items-center"
        :class="{
          'mb-0': index == listTodo.length - 1,
          'mb-2': index != listTodo.length - 1,
        }"
      >
        <input
          class="w-full p-1 focus:outline-0 rounded mr-1"
          v-model="todo.content"
          @input="updateTodo(index)"
          @focus="
            //@ts-ignore
            $event.target.select()
          "
          :class="{
            'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20':
              todo.color === 0,
            'bg-red-400/50 hover:bg-red-400/80': todo.color === 1,
            'bg-green-400/50 hover:bg-green-400/80': todo.color === 2,
            'bg-blue-400/50 hover:bg-blue-400/80': todo.color === 3,
          }"
        />
        <button
          v-if="sortable && index != 0"
          class="btn-primary icon mr-1"
          @click="shiftTodo(index, 'up')"
        >
          <img
            class="hidden dark:block"
            src="../assets/vertical_align_top_white.svg"
          />
          <img
            class="block dark:hidden"
            src="../assets/vertical_align_top_black.svg"
          />
        </button>
        <button
          v-if="sortable && index != listTodo.length - 1"
          class="btn-primary icon mr-1"
          @click="shiftTodo(index, 'down')"
        >
          <img
            class="hidden dark:block"
            src="../assets/vertical_align_bottom_white.svg"
          />
          <img
            class="block dark:hidden"
            src="../assets/vertical_align_bottom_black.svg"
          />
        </button>
        <button class="btn-primary icon mr-1" @click="colorRequest(index)">
          <img class="hidden dark:block" src="../assets/palette_white.svg" />
          <img class="block dark:hidden" src="../assets/palette_black.svg" />
        </button>
        <button class="btn-primary icon" @click="deleteRequest(index)">
          <img class="hidden dark:block" src="../assets/delete_white.svg" />
          <img class="block dark:hidden" src="../assets/delete_black.svg" />
        </button>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row">
      <button class="btn-primary text sm:mr-1" @click="addTodo">
        Add todo
      </button>
      <button
        class="btn-primary text mt-1 sm:mt-0"
        @click="sortable = !sortable"
      >
        <span v-if="!sortable">Sort order</span>
        <span v-if="sortable">Finish order sorting</span>
      </button>
    </div>
  </div>

  <DialogConfirm
    v-if="triggerDialogConfirm"
    title="Delete todo ?"
    content="Are you sure you want to delete this todo ?<br/>Impossible to recover after delete"
    @delete="deleteTodo"
    @cancel="triggerDialogConfirm = false"
  ></DialogConfirm>
  <DialogColor
    v-if="triggerDialogColor"
    @user-action="updateColor"
    @cancel="triggerDialogColor = false"
  >
  </DialogColor>
  <DialogError
    v-if="triggerDialogError"
    :content="contentDialogError"
    @cancel="releaseDialogError()"
  ></DialogError>
</template>

<style scoped></style>
