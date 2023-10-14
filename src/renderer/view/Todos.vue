<script lang="ts" setup>
import DialogConfirm from '../components/DialogConfirm.vue';
import DialogColor from '../components/DialogColor.vue';
import DialogError from '../components/DialogError.vue';
import { ipcMainControl } from '../../main/static/ipcMainControl';
import { ref, Ref, onMounted } from 'vue';

let listTodo: Ref<
  {
    id: number;
    type: number;
    title: string;
    content: string;
    color: number;
    list: any;
  }[]
> = ref([]);
let selectedID: Ref<number> = ref(-1);
let selectedTodoGroupID: Ref<number> = ref(-1);
let triggerDialogDeleteTodo: Ref<boolean> = ref(false);
let triggerDialogDeleteTodoGroup: Ref<boolean> = ref(false);
let triggerDialogDeleteTodoGroupTodo: Ref<boolean> = ref(false);
let triggerDialogTodoColor: Ref<boolean> = ref(false);
let triggerDialogTodoGroupTodoColor: Ref<boolean> = ref(false);
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

const addTodoGroup = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_ADD])
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

const addTodoGroupTodo = (id: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_ADD, id])
    .then((result: any) => {
      getTodo();
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
    .then((result: any) => {})
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message + 'test';
    });
};

const updateTodoGroupTodo = (id: number, sub_id: number) => {
  window.electronAPI
    .setCommand([
      ipcMainControl.TODO_GROUP_TODO_UPDATE,
      id,
      sub_id,
      JSON.parse(JSON.stringify(listTodo.value[id].list[sub_id])),
    ])
    .then((result: any) => {})
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const shiftTodo = (id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_SHIFT, id, content])
    .then((result: any) => {
      getTodo();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const shiftTodoGroupTodo = (id: number, sub_id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_SHIFT, id, sub_id, content])
    .then((result: any) => {
      getTodo();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const colorTodoRequest = (id: number) => {
  selectedID.value = id;
  triggerDialogTodoColor.value = true;
};

const colorTodoGroupTodoRequest = (id: number, sub_id: number) => {
  selectedID.value = id;
  selectedTodoGroupID.value = sub_id;
  triggerDialogTodoGroupTodoColor.value = true;
};

const updateTodoColor = (color: number) => {
  if (color >= 0) {
    listTodo.value[selectedID.value].color = color;
    updateTodo(selectedID.value);
  }
  selectedID.value = -1;
  triggerDialogTodoColor.value = false;
};

const updateTodoGroupTodoColor = (color: number) => {
  if (color >= 0) {
    listTodo.value[selectedID.value].list[selectedTodoGroupID.value].color =
      color;
    updateTodoGroupTodo(selectedID.value, selectedTodoGroupID.value);
  }
  selectedID.value = -1;
  selectedTodoGroupID.value = -1;
  triggerDialogTodoGroupTodoColor.value = false;
};

const deleteTodoRequest = (id: number) => {
  selectedID.value = id;
  triggerDialogDeleteTodo.value = true;
};

const deleteTodoGroupRequest = (id: number) => {
  selectedID.value = id;
  triggerDialogDeleteTodoGroup.value = true;
};

const deleteTodoGroupTodoRequest = (id: number, sub_id: number) => {
  selectedID.value = id;
  selectedTodoGroupID.value = sub_id;
  triggerDialogDeleteTodoGroupTodo.value = true;
};

const deleteTodo = () => {
  triggerDialogDeleteTodo.value = false;
  window.electronAPI
    .setCommand([ipcMainControl.TODO_DELETE, selectedID.value])
    .then((result: any) => {
      getTodo();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
  selectedID.value = -1;
};

const deleteTodoGroup = () => {
  triggerDialogDeleteTodoGroup.value = false;
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_DELETE, selectedID.value])
    .then((result: any) => {
      getTodo();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
  selectedID.value = -1;
};

const deleteTodoGroupTodo = () => {
  triggerDialogDeleteTodoGroupTodo.value = false;
  window.electronAPI
    .setCommand([
      ipcMainControl.TODO_GROUP_TODO_DELETE,
      selectedID.value,
      selectedTodoGroupID.value,
    ])
    .then((result: any) => {
      getTodo();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
  selectedID.value = -1;
  selectedTodoGroupID.value = -1;
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
      <div v-if="todo.type != 32" class="flex items-center">
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
        <button class="btn-primary icon mr-1" @click="colorTodoRequest(index)">
          <img class="hidden dark:block" src="../assets/palette_white.svg" />
          <img class="block dark:hidden" src="../assets/palette_black.svg" />
        </button>
        <button class="btn-primary icon" @click="deleteTodoRequest(index)">
          <img class="hidden dark:block" src="../assets/delete_white.svg" />
          <img class="block dark:hidden" src="../assets/delete_black.svg" />
        </button>
      </div>
      <div
        v-if="todo.type == 32"
        class="flex flex-col justify-center bg-black/10 dark:bg-white/10 rounded p-2"
      >
        <div class="flex items-center">
          <p class="w-full">{{ todo.title }}</p>
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
          <button class="btn-primary text" @click="addTodoGroupTodo(index)">
            Add todo
          </button>
          <button
            class="btn-primary text ml-1"
            @click="deleteTodoGroupRequest(index)"
          >
            Delete group
          </button>
        </div>
        <div
          v-if="todo.list.length != 0"
          v-for="(sub_todo, sub_index) in todo.list"
          class="flex mt-2 mb-0 last:mb-0"
        >
          <input
            class="w-full p-1 focus:outline-0 rounded mr-1"
            v-model="sub_todo.content"
            @input="updateTodoGroupTodo(index, sub_index)"
            @focus="
              //@ts-ignore
              $event.target.select()
            "
            :class="{
              'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20':
                sub_todo.color === 0,
              'bg-red-400/50 hover:bg-red-400/80': sub_todo.color === 1,
              'bg-green-400/50 hover:bg-green-400/80': sub_todo.color === 2,
              'bg-blue-400/50 hover:bg-blue-400/80': sub_todo.color === 3,
            }"
          />
          <button
            v-if="sortable && sub_index != 0"
            class="btn-primary icon mr-1"
            @click="shiftTodoGroupTodo(index, sub_index, 'up')"
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
            v-if="sortable && sub_index != todo.list.length - 1"
            class="btn-primary icon mr-1"
            @click="shiftTodoGroupTodo(index, sub_index, 'down')"
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
          <button
            class="btn-primary icon mr-1"
            @click="colorTodoGroupTodoRequest(index, sub_index)"
          >
            <img class="hidden dark:block" src="../assets/palette_white.svg" />
            <img class="block dark:hidden" src="../assets/palette_black.svg" />
          </button>
          <button
            class="btn-primary icon"
            @click="deleteTodoGroupTodoRequest(index, sub_index)"
          >
            <img class="hidden dark:block" src="../assets/delete_white.svg" />
            <img class="block dark:hidden" src="../assets/delete_black.svg" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row">
      <button class="btn-primary text sm:mr-1" @click="addTodo">Add todo</button
      ><button class="btn-primary text sm:mr-1" @click="addTodoGroup">
        Add group
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
    v-if="triggerDialogDeleteTodo"
    title="Delete todo ?"
    content="Are you sure you want to delete this todo ?<br/>Impossible to recover after delete"
    @delete="deleteTodo"
    @cancel="triggerDialogDeleteTodo = false"
  ></DialogConfirm>
  <DialogConfirm
    v-if="triggerDialogDeleteTodoGroup"
    title="Delete todo group ?"
    content="Are you sure you want to delete this todo group ?<br/>All the todo in the group will be definitively lost"
    @delete="deleteTodoGroup"
    @cancel="triggerDialogDeleteTodoGroup = false"
  ></DialogConfirm>
  <DialogConfirm
    v-if="triggerDialogDeleteTodoGroupTodo"
    title="Delete todo ?"
    content="Are you sure you want to delete this todo ?<br/>Impossible to recover after delete"
    @delete="deleteTodoGroupTodo"
    @cancel="triggerDialogDeleteTodoGroupTodo = false"
  ></DialogConfirm>
  <DialogColor
    v-if="triggerDialogTodoColor"
    @user-action="updateTodoColor"
    @cancel="triggerDialogTodoColor = false"
  >
  </DialogColor>
  <DialogColor
    v-if="triggerDialogTodoGroupTodoColor"
    @user-action="updateTodoGroupTodoColor"
    @cancel="triggerDialogTodoGroupTodoColor = false"
  >
  </DialogColor>
  <DialogError
    v-if="triggerDialogError"
    :content="contentDialogError"
    @cancel="releaseDialogError()"
  ></DialogError>
</template>

<style scoped></style>
