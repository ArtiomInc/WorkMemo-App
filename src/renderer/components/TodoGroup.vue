<script setup lang="ts">
import { ArrowDownToLine, ArrowUpToLine, Check, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'

import { useDeleteStore } from '../stores/DialogDelete'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  subIndex: {
    type: Number,
    required: true
  },
  sortable: {
    type: Boolean,
    required: true
  },
  canShiftUp: {
    type: Boolean,
    required: true
  },
  canShiftDown: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['addTodoInGroup', 'updateTitle', 'shiftGroup', 'deleteGroup'])
const deleteStore = useDeleteStore()

const editableTitle = ref(false)
const titleEdited = ref('')
const askedDelete = ref(false)

watch(editableTitle, (state: boolean) => {
  if (state) {
    titleEdited.value = props.title
  }
})

watch(
  () => deleteStore.deleteState,
  (value) => {
    if (value === false && deleteStore.deleteLastResultAction === true && askedDelete.value === true) {
      deleteTodo()
      deleteStore.setDeleteLastResult(false)
    }
    if (value === false) {
      askedDelete.value = false
    }
  }
)

const askDeleteTodo = () => {
  askedDelete.value = true
  deleteStore.setDeleteState(
    true,
    'Are you sure you want to delete this todo group ?<br> Once the data is deleted, it cannot be recovered.'
  )
}

const deleteTodo = () => {
  emit('deleteGroup', props.index, props.subIndex)
}
</script>

<template>
  <div class="flex flex-col rounded bg-black/10 p-2 dark:bg-white/10">
    <div class="mb-1 flex w-full gap-1">
      <div class="flex w-full items-center">
        <div v-if="!editableTitle" class="flex w-full items-center">
          <p class="w-full">{{ props.title }}</p>
          <button class="btn secondary w-8 min-w-8 p-0" @click="editableTitle = !editableTitle">
            <Pencil class="text-black dark:text-white" :size="20" />
          </button>
        </div>
        <div v-else class="flex w-full items-center gap-1">
          <input
            v-model="titleEdited"
            class="input secondary w-full"
            type="text"
            @change="emit('updateTitle', index, titleEdited)"
          />
          <button class="btn secondary w-8 min-w-8 p-0" @click="editableTitle = !editableTitle">
            <Check class="text-black dark:text-white" :size="20" />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          v-if="props.sortable"
          :disabled="!canShiftUp"
          class="btn secondary w-8 min-w-8 p-0"
          @click="emit('shiftGroup', props.index, props.subIndex, 'up')"
        >
          <ArrowUpToLine class="text-black dark:text-white" :size="20" />
        </button>
        <button
          v-if="props.sortable"
          :disabled="!canShiftDown"
          class="btn secondary w-8 min-w-8 p-0"
          @click="emit('shiftGroup', props.index, props.subIndex, 'down')"
        >
          <ArrowDownToLine class="text-black dark:text-white" :size="20" />
        </button>
        <button class="btn secondary w-8 min-w-8 p-0" @click="emit('addTodoInGroup', props.index)">
          <Plus class="text-black dark:text-white" :size="20" />
        </button>
        <button class="btn secondary w-8 min-w-8 p-0" @click="askDeleteTodo">
          <Trash2 class="text-black dark:text-white" :size="20" />
        </button>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
