<script lang="ts" setup>
import { ArrowDownToLine, ArrowUpToLine, Check, Palette, Trash2 } from 'lucide-vue-next'
import { onMounted, ref, Ref } from 'vue'

import { ipcMainControl } from '../../main/static/ipcMainControl'
import DialogColor from '../components/DialogColor.vue'
import DialogConfirm from '../components/DialogConfirm.vue'
import DialogError from '../components/DialogError.vue'

const listTodo: Ref<
  {
    id: number
    type: number
    title: string
    content: string
    color: number
    list: any
  }[]
> = ref([])
const selectedID: Ref<number> = ref(-1)
const selectedTodoGroupID: Ref<number> = ref(-1)
const triggerDialogDeleteTodo: Ref<boolean> = ref(false)
const triggerDialogDeleteTodoGroup: Ref<boolean> = ref(false)
const triggerDialogDeleteTodoGroupTodo: Ref<boolean> = ref(false)
const triggerDialogTodoColor: Ref<boolean> = ref(false)
const triggerDialogTodoGroupTodoColor: Ref<boolean> = ref(false)
const triggerDialogError: Ref<boolean> = ref(false)
const contentDialogError: Ref<string> = ref('')
const sortable: Ref<boolean> = ref(false)
const editTodoGroupTitle: Ref<boolean> = ref(false)

const getTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GET])
    .then((result: any) => {
      listTodo.value = result
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const addTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_ADD])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const addTodoGroup = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_ADD])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const addTodoGroupTodo = (id: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_ADD, id])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const updateTodo = (id: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_UPDATE, id, JSON.parse(JSON.stringify(listTodo.value[id]))])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const updateTodoGroupTitle = (id: number) => {
  editTodoGroupTitle.value = false
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_UPDATE_TITLE, id, listTodo.value[id].title])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const updateTodoGroupTodo = (id: number, sub_id: number) => {
  window.electronAPI
    .setCommand([
      ipcMainControl.TODO_GROUP_TODO_UPDATE,
      id,
      sub_id,
      JSON.parse(JSON.stringify(listTodo.value[id].list[sub_id])),
    ])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const shiftTodo = (id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_SHIFT, id, content])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const shiftTodoGroupTodo = (id: number, sub_id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_SHIFT, id, sub_id, content])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const colorTodoRequest = (id: number) => {
  selectedID.value = id
  triggerDialogTodoColor.value = true
}

const colorTodoGroupTodoRequest = (id: number, sub_id: number) => {
  selectedID.value = id
  selectedTodoGroupID.value = sub_id
  triggerDialogTodoGroupTodoColor.value = true
}

const updateTodoColor = (color: number) => {
  if (color >= 0) {
    listTodo.value[selectedID.value].color = color
    updateTodo(selectedID.value)
  }
  selectedID.value = -1
  triggerDialogTodoColor.value = false
}

const updateTodoGroupTodoColor = (color: number) => {
  if (color >= 0) {
    listTodo.value[selectedID.value].list[selectedTodoGroupID.value].color = color
    updateTodoGroupTodo(selectedID.value, selectedTodoGroupID.value)
  }
  selectedID.value = -1
  selectedTodoGroupID.value = -1
  triggerDialogTodoGroupTodoColor.value = false
}

const deleteTodoRequest = (id: number) => {
  selectedID.value = id
  triggerDialogDeleteTodo.value = true
}

const deleteTodoGroupRequest = (id: number) => {
  selectedID.value = id
  triggerDialogDeleteTodoGroup.value = true
}

const deleteTodoGroupTodoRequest = (id: number, sub_id: number) => {
  selectedID.value = id
  selectedTodoGroupID.value = sub_id
  triggerDialogDeleteTodoGroupTodo.value = true
}

const deleteTodo = () => {
  triggerDialogDeleteTodo.value = false
  window.electronAPI
    .setCommand([ipcMainControl.TODO_DELETE, selectedID.value])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
  selectedID.value = -1
}

const deleteTodoGroup = () => {
  triggerDialogDeleteTodoGroup.value = false
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_DELETE, selectedID.value])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
  selectedID.value = -1
}

const deleteTodoGroupTodo = () => {
  triggerDialogDeleteTodoGroupTodo.value = false
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_DELETE, selectedID.value, selectedTodoGroupID.value])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
  selectedID.value = -1
  selectedTodoGroupID.value = -1
}

const releaseDialogError = () => {
  triggerDialogError.value = false
  contentDialogError.value = ''
}

onMounted(async () => {
  getTodo()
})
</script>

<template>
  <div class="m-2 rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
    <div v-if="listTodo.length != 0">
      <div v-for="(todo, index) in listTodo" :key="index" class="mb-2">
        <div v-if="todo.type != 32" class="flex items-center gap-1">
          <input
            v-model="todo.content"
            class="w-full rounded p-1 focus:outline-0"
            :class="{
              'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20': todo.color === 0,
              'bg-red-400/50 hover:bg-red-400/80': todo.color === 1,
              'bg-green-400/50 hover:bg-green-400/80': todo.color === 2,
              'bg-blue-400/50 hover:bg-blue-400/80': todo.color === 3,
            }"
            @input="updateTodo(index)"
            @focus="
              //@ts-ignore
              $event.target.select()
            "
          />
          <button v-if="sortable && index != 0" class="btn primary" @click="shiftTodo(index, 'up')">
            <ArrowUpToLine class="text-black dark:text-white" :size="20" />
          </button>
          <button v-if="sortable && index != listTodo.length - 1" class="btn primary" @click="shiftTodo(index, 'down')">
            <ArrowDownToLine class="text-black dark:text-white" :size="20" />
          </button>
          <button class="btn primary" @click="colorTodoRequest(index)">
            <Palette class="text-black dark:text-white" :size="20" />
          </button>
          <button class="btn primary" @click="deleteTodoRequest(index)">
            <Trash2 class="text-black dark:text-white" :size="20" />
          </button>
        </div>
        <div v-if="todo.type == 32" class="flex flex-col justify-center rounded bg-black/10 p-2 dark:bg-white/10">
          <div class="flex items-center">
            <div class="w-full">
              <p v-if="!editTodoGroupTitle" @click="editTodoGroupTitle = true">
                {{ todo.title }}
              </p>
              <div v-if="editTodoGroupTitle" class="flex items-center">
                <input
                  ref="titleinput"
                  v-model="todo.title"
                  class="h-8 w-full rounded border border-black/10 bg-black/10 px-1 outline-none dark:border-white/10 dark:bg-white/10 dark:text-neutral-200"
                  type="text"
                  @keydown.enter="updateTodoGroupTitle(index)"
                />
                <button class="btn primary" @click="updateTodoGroupTitle(index)">
                  <Check class="text-black dark:text-white" :size="20" />
                </button>
              </div>
            </div>
            <div class="mb-1 flex flex-row gap-1">
              <button v-if="sortable && index != 0" class="btn primary" @click="shiftTodo(index, 'up')">
                <ArrowUpToLine class="text-black dark:text-white" :size="20" />
              </button>
              <button
                v-if="sortable && index != listTodo.length - 1"
                class="btn primary"
                @click="shiftTodo(index, 'down')"
              >
                <ArrowDownToLine class="text-black dark:text-white" :size="20" />
              </button>
              <button class="btn primary" @click="addTodoGroupTodo(index)">Add todo</button>
              <button class="btn primary" @click="deleteTodoGroupRequest(index)">Delete group</button>
            </div>
          </div>
          <div v-if="todo.list.length != 0">
            <div v-for="(sub_todo, sub_index) in todo.list" :key="sub_index" class="mb-1 flex gap-1">
              <input
                v-model="sub_todo.content"
                class="w-full rounded p-1 focus:outline-0"
                :class="{
                  'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20': sub_todo.color === 0,
                  'bg-red-400/50 hover:bg-red-400/80': sub_todo.color === 1,
                  'bg-green-400/50 hover:bg-green-400/80': sub_todo.color === 2,
                  'bg-blue-400/50 hover:bg-blue-400/80': sub_todo.color === 3,
                }"
                @input="updateTodoGroupTodo(index, sub_index)"
                @focus="
                  //@ts-ignore
                  $event.target.select()
                "
              />
              <button
                v-if="sortable && sub_index != 0"
                class="btn primary"
                @click="shiftTodoGroupTodo(index, sub_index, 'up')"
              >
                <ArrowUpToLine class="text-black dark:text-white" :size="20" />
              </button>
              <button
                v-if="sortable && sub_index != todo.list.length - 1"
                class="btn primary"
                @click="shiftTodoGroupTodo(index, sub_index, 'down')"
              >
                <ArrowDownToLine class="text-black dark:text-white" :size="20" />
              </button>
              <button class="btn primary" @click="colorTodoGroupTodoRequest(index, sub_index)">
                <Palette class="text-black dark:text-white" :size="20" />
              </button>
              <button class="btn primary" @click="deleteTodoGroupTodoRequest(index, sub_index)">
                <Trash2 class="text-black dark:text-white" :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row">
      <button class="btn primary text sm:mr-1" @click="addTodo">Add todo</button
      ><button class="btn primary text mt-1 sm:mr-1 sm:mt-0" @click="addTodoGroup">Add group</button>
      <button class="btn primary text mt-1 sm:mt-0" @click="sortable = !sortable">
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
  <DialogColor v-if="triggerDialogTodoColor" @user-action="updateTodoColor" @cancel="triggerDialogTodoColor = false">
  </DialogColor>
  <DialogColor
    v-if="triggerDialogTodoGroupTodoColor"
    @user-action="updateTodoGroupTodoColor"
    @cancel="triggerDialogTodoGroupTodoColor = false"
  >
  </DialogColor>
  <DialogError v-if="triggerDialogError" :content="contentDialogError" @cancel="releaseDialogError()"></DialogError>
</template>

<style scoped></style>
