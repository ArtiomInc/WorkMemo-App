<script lang="ts" setup>
import { ArrowDownWideNarrow, Plus } from 'lucide-vue-next'
import { onMounted, ref, Ref } from 'vue'

import { ipcMainControl } from '../../main/static/ipcMainControl'
import TodoGroup from '../components/TodoGroup.vue'
import TodoSingle from '../components/TodoSingle.vue'
import { useErrorStore } from '../stores/DialogError'

const errorStore = useErrorStore()

const listTodo: Ref<
  {
    id: number
    content: string
    type?: number
    title?: string
    color?: number
    list?: {
      id: number
      content: string
      type: number
      color: number
    }[]
  }[]
> = ref([])

const sortable: Ref<boolean> = ref(false)

const getTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GET])
    .then((result: any) => {
      listTodo.value = result
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_ADD])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateTodoOrGroup = (index: number, sub_index: number, content: string, color: number) => {
  listTodo.value[index].content = content
  listTodo.value[index].color = color
  window.electronAPI
    .setCommand([ipcMainControl.TODO_UPDATE, index, JSON.parse(JSON.stringify(listTodo.value[index]))])
    .then(() => {})
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateTodoInGroup = (index: number, sub_index: number, content: string, color: number) => {
  if (listTodo.value[index].list) {
    listTodo.value[index].list[sub_index].content = content
    listTodo.value[index].list[sub_index].color = color
    window.electronAPI
      .setCommand([
        ipcMainControl.TODO_GROUP_TODO_UPDATE,
        index,
        sub_index,
        JSON.parse(JSON.stringify(listTodo.value[index].list[sub_index])),
      ])
      .then(() => {})
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  }
}

const deleteTodo = (index: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_DELETE, index])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const shiftTodoOrGroup = (index: number, sub_index: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_SHIFT, index, content])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addGroupOfTodo = () => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_ADD])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addTodoInGroup = (index: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_ADD, index])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateTodoGroupTitle = (index: number, title: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_UPDATE_TITLE, index, title])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const shiftTodoInGroup = (index: number, sub_index: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_SHIFT, index, sub_index, content])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}
const deleteGroupOfTodo = (index: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_DELETE, index])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const deleteTodoInGroup = (index: number, sub_index: number) => {
  window.electronAPI
    .setCommand([ipcMainControl.TODO_GROUP_TODO_DELETE, index, sub_index])
    .then(() => {
      getTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

onMounted(async () => {
  getTodo()
})
</script>

<template>
  <div class="m-2 flex flex-col gap-2 rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800">
    <div v-for="(todo, index) in listTodo" :key="index">
      <TodoSingle
        v-if="todo.list == undefined"
        :color="todo.color"
        :content="todo.content"
        :index="index"
        :sub_index="-1"
        :can-shift-up="index > 0 && sortable"
        :can-shift-down="index < listTodo.length - 1 && sortable"
        @updated-todo="updateTodoOrGroup"
        @shift-todo="shiftTodoOrGroup"
        @delete-todo="deleteTodo"
      ></TodoSingle>
      <TodoGroup
        v-if="todo.title"
        :title="todo.title"
        :index="index"
        :sub_index="-1"
        :can-shift-up="index > 0 && sortable"
        :can-shift-down="index < listTodo.length - 1 && sortable"
        @add-todo-in-group="addTodoInGroup"
        @update-title="updateTodoGroupTitle"
        @shift-group="shiftTodoOrGroup"
        @delete-group="deleteGroupOfTodo"
      >
        <div v-if="todo.list != undefined" class="flex flex-col gap-1">
          <TodoSingle
            v-for="(sub_todo, sub_index) in todo.list"
            :key="sub_index"
            :color="sub_todo.color"
            :content="sub_todo.content"
            :index="index"
            :sub_index="sub_index"
            :can-shift-up="sub_index > 0 && sortable"
            :can-shift-down="sub_index < todo.list.length - 1 && sortable"
            @updated-todo="updateTodoInGroup"
            @shift-todo="shiftTodoInGroup"
            @delete-todo="deleteTodoInGroup"
          ></TodoSingle></div
      ></TodoGroup>
    </div>
    <div class="flex items-center gap-1">
      <button class="btn secondary" @click="addTodo">
        <Plus class="text-black dark:text-white" :size="20" />
        todo
      </button>
      <button class="btn secondary" @click="addGroupOfTodo">
        <Plus class="text-black dark:text-white" :size="20" />
        group
      </button>
      <button class="btn secondary" @click="sortable = !sortable">
        <ArrowDownWideNarrow class="text-black dark:text-white" :size="20" />
        sort
      </button>
    </div>
  </div>
</template>

<style scoped></style>
