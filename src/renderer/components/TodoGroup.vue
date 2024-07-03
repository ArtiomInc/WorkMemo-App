<script setup lang="ts">
import { ArrowDownToLine, ArrowUpToLine, Check, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { nextTick, reactive, ref, Ref, watch } from 'vue'

import Modal from './ui/Modal.vue'

const props = defineProps<{
  title: string
  index: number
  subIndex: number
  sortable: boolean
  canShiftUp: boolean
  canShiftDown: boolean
}>()

const emit = defineEmits<{
  (e: 'deleteGroup', index: number, subIndex: number): void
  (e: 'shiftGroup', index: number, subIndex: number, direction: 'up' | 'down'): void
  (e: 'addTodoInGroup', index: number): void
  (e: 'updateTitle', index: number, title: string): void
}>()

const editableTitle = ref(false)
const todoGroupTitleInput: Ref<HTMLElement | null> = ref(document.getElementById('todogrouptitle'))
const titleEdited = ref('')
const remove = reactive({
  state: false,
  message: '',
  delete() {
    emit('deleteGroup', props.index, props.subIndex)
    this.state = false
  },
  cancel() {
    this.state = false
  }
})

watch(editableTitle, (state: boolean) => {
  if (state) {
    titleEdited.value = props.title
    nextTick(() => {
      if (todoGroupTitleInput.value) {
        todoGroupTitleInput.value.focus()
      }
    })
  }
})
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
            ref="todogrouptitle"
            v-model="titleEdited"
            class="input secondary w-full"
            type="text"
            @change="emit('updateTitle', index, titleEdited)"
            @blur="editableTitle = !editableTitle"
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
        <button class="btn secondary w-8 min-w-8 p-0" @click="remove.state = true">
          <Trash2 class="text-black dark:text-white" :size="20" />
        </button>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
  <Modal v-if="remove.state">
    <h1 class="text-lg font-bold">Delete todo group ?</h1>
    <p>
      Are you sure you want to delete this todo group ?<br />
      Once the data is deleted, it cannot be recovered.
    </p>
    <div class="mt-2 flex justify-end gap-1">
      <button class="btn error" @click="remove.delete()">Delete</button>
      <button class="btn secondary" @click="remove.cancel()">Cancel</button>
    </div>
  </Modal>
</template>
