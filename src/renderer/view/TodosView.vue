<script lang="ts" setup>
import { ArrowDownWideNarrow, Plus } from 'lucide-vue-next'
import { onMounted, ref, Ref } from 'vue'

import { TodoCommands } from '../../main/static/TodoCommands'
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

const getListTodo = () => {
  window.electronAPI
    .setCommand([TodoCommands.GET_LIST_TODO])
    .then((result: any) => {
      listTodo.value = result
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addNewTodo = () => {
  window.electronAPI
    .setCommand([TodoCommands.ADD_NEW_TODO])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateTodo = (index: number, sub_index: number, content: string, color: number) => {
  listTodo.value[index].content = content
  listTodo.value[index].color = color
  window.electronAPI
    .setCommand([TodoCommands.UPDATE_TODO, index, JSON.parse(JSON.stringify(listTodo.value[index]))])
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
        TodoCommands.UPDATE_TODO_IN_GROUP,
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
    .setCommand([TodoCommands.DELETE_TODO, index])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const shiftTodo = (index: number, sub_index: number, content: string) => {
  window.electronAPI
    .setCommand([TodoCommands.SHIT_TODO, index, content])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addNewGroup = () => {
  window.electronAPI
    .setCommand([TodoCommands.ADD_NEW_GROUP])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addTodoInGroup = (index: number) => {
  window.electronAPI
    .setCommand([TodoCommands.ADD_TODO_IN_GROUP, index])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateTitleGroup = (index: number, title: string) => {
  window.electronAPI
    .setCommand([TodoCommands.UPDATE_TITLE_GROUP, index, title])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const shiftTodoInGroup = (index: number, sub_index: number, content: string) => {
  window.electronAPI
    .setCommand([TodoCommands.SHIFT_TODO_IN_GROUP, index, sub_index, content])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}
const deleteGroup = (index: number) => {
  window.electronAPI
    .setCommand([TodoCommands.DELETE_GROUP, index])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const deleteTodoInGroup = (index: number, sub_index: number) => {
  window.electronAPI
    .setCommand([TodoCommands.DELETE_TODO_IN_GROUP, index, sub_index])
    .then(() => {
      getListTodo()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

onMounted(async () => {
  getListTodo()
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
        :sub-index="-1"
        :can-shift-up="index > 0 && sortable"
        :can-shift-down="index < listTodo.length - 1 && sortable"
        @updated-todo="updateTodo"
        @shift-todo="shiftTodo"
        @delete-todo="deleteTodo"
      ></TodoSingle>
      <TodoGroup
        v-if="todo.title"
        :title="todo.title"
        :index="index"
        :sub-index="-1"
        :can-shift-up="index > 0 && sortable"
        :can-shift-down="index < listTodo.length - 1 && sortable"
        @add-todo-in-group="addTodoInGroup"
        @update-title="updateTitleGroup"
        @shift-group="shiftTodo"
        @delete-group="deleteGroup"
      >
        <div v-if="todo.list != undefined" class="flex flex-col gap-1">
          <TodoSingle
            v-for="(sub_todo, sub_index) in todo.list"
            :key="sub_index"
            :color="sub_todo.color"
            :content="sub_todo.content"
            :index="index"
            :sub-index="sub_index"
            :can-shift-up="sub_index > 0 && sortable"
            :can-shift-down="sub_index < todo.list.length - 1 && sortable"
            @updated-todo="updateTodoInGroup"
            @shift-todo="shiftTodoInGroup"
            @delete-todo="deleteTodoInGroup"
          ></TodoSingle></div
      ></TodoGroup>
    </div>
    <div class="flex items-center gap-1">
      <button class="btn secondary" @click="addNewTodo">
        <Plus class="text-black dark:text-white" :size="20" />
        todo
      </button>
      <button class="btn secondary" @click="addNewGroup">
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
