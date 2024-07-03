<script setup lang="ts">
import { ArrowDownToLine, ArrowUpToLine, Palette, Trash2 } from 'lucide-vue-next'
import { onMounted, reactive, ref } from 'vue'

import Modal from './ui/Modal.vue'

const props = defineProps<{
  color: number
  content: string
  index: number
  subIndex: number
  sortable: boolean
  canShiftUp: boolean
  canShiftDown: boolean
}>()

const emit = defineEmits<{
  (e: 'updatedTodo', index: number, subIndex: number, content: string, color: number): void
  (e: 'shiftTodo', index: number, subIndex: number, direction: 'up' | 'down'): void
  (e: 'deleteTodo', index: number, subIndex: number): void
}>()

const contentEdited = ref('')
const remove = reactive({
  state: false,
  message: '',
  delete() {
    emit('deleteTodo', props.index, props.subIndex)
    this.state = false
  },
  cancel() {
    this.state = false
  }
})
const color = reactive({
  state: false,
  message: '',
  update(id: number) {
    emit('updatedTodo', props.index, props.subIndex, contentEdited.value, id)
    this.state = false
  },
  cancel() {
    this.state = false
  }
})

onMounted(() => {
  contentEdited.value = props.content
})
</script>

<template>
  <div class="flex w-full items-center gap-1">
    <input
      v-model="contentEdited"
      class="input w-full border-transparent"
      :class="{
        'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20': props.color === 0,
        'bg-red-400/50 hover:bg-red-400/80': props.color === 1,
        'bg-green-400/50 hover:bg-green-400/80': props.color === 2,
        'bg-blue-400/50 hover:bg-blue-400/80': props.color === 3
      }"
      @focus="$event.target && ($event.target as HTMLInputElement).select()"
      @input="emit('updatedTodo', props.index, props.subIndex, contentEdited, props.color)"
    />
    <button
      v-if="props.sortable"
      :disabled="!props.canShiftUp"
      class="btn secondary w-8 min-w-8 p-0"
      @click="emit('shiftTodo', props.index, props.subIndex, 'up')"
    >
      <ArrowUpToLine class="text-black dark:text-white" :size="20" />
    </button>
    <button
      v-if="props.sortable"
      :disabled="!props.canShiftDown"
      class="btn secondary group w-8 min-w-8 p-0"
      @click="emit('shiftTodo', props.index, props.subIndex, 'down')"
    >
      <ArrowDownToLine class="text-black dark:text-white" :size="20" />
    </button>
    <button class="btn secondary w-8 min-w-8 p-0" @click="color.state = true">
      <Palette class="text-black dark:text-white" :size="20" />
    </button>
    <button class="btn secondary group w-8 min-w-8 p-0" @click="remove.state = true">
      <Trash2 class="text-black dark:text-white" :size="20" />
    </button>
  </div>
  <Modal v-if="remove.state">
    <h1 class="text-lg font-bold">Delete todo ?</h1>
    <p>
      Are you sure you want to delete this todo ?<br />
      Once the data is deleted, it cannot be recovered.
    </p>
    <div class="mt-2 flex justify-end gap-1">
      <button class="btn error" @click="remove.delete()">Delete</button>
      <button class="btn secondary" @click="remove.cancel()">Cancel</button>
    </div>
  </Modal>
  <Modal v-if="color.state">
    <h1 class="text-center text-lg font-bold">Choose color</h1>
    <div class="mb-2 flex">
      <div
        class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-red-400 transition-[outline] duration-100 hover:outline"
        @click="color.update(1)"
      />
      <div
        class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-green-400 transition-[outline] duration-100 hover:outline"
        @click="color.update(2)"
      />
      <div
        class="m-1 aspect-square h-8 cursor-pointer rounded-full bg-blue-400 transition-[outline] duration-100 hover:outline"
        @click="color.update(3)"
      />
      <div
        class="m-1 aspect-square h-8 cursor-pointer rounded-full transition-[outline] duration-100 hover:outline"
        style="background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 1) 100%)"
        @click="color.update(0)"
      />
    </div>
    <button class="btn secondary w-full" @click="color.cancel()">Cancel</button>
  </Modal>
</template>
