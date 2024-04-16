<script setup lang="ts">
import { ArrowDownToLine, ArrowUpToLine, Palette, Trash2 } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

import { useColorStore } from '../stores/DialogColor'
import { useDeleteStore } from '../stores/DialogDelete'

const props = defineProps({
  color: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
    required: true,
  },
  subIndex: {
    type: Number,
    required: true,
  },
  canShiftUp: {
    type: Boolean,
    required: true,
  },
  canShiftDown: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['updatedTodo', 'shiftTodo', 'deleteTodo'])
const deleteStore = useDeleteStore()
const colorStore = useColorStore()

const contentEdited = ref('')
const askedDelete = ref(false)
const askedColor = ref(false)

onMounted(() => {
  contentEdited.value = props.content
})

watch(
  () => props.content,
  () => {
    contentEdited.value = props.content
  }
)

watch(
  () => deleteStore.deleteState,
  (value) => {
    if (value == false && deleteStore.deleteLastResultAction == true && askedDelete.value == true) {
      deleteTodo()
      deleteStore.setDeleteLastResult(false)
    }
    if (value == false) {
      askedDelete.value = false
    }
  }
)

watch(
  () => colorStore.colorState,
  (value) => {
    if (value == false && colorStore.colorLastResultAction == true && askedColor.value == true) {
      emit('updatedTodo', props.index, props.subIndex, contentEdited.value, colorStore.colorLastChoice)
      colorStore.setColorLastChoice(-1)
      colorStore.setColorLastResult(false)
    }
    if (value == false) {
      askedColor.value = false
    }
  }
)

const askColorTodo = () => {
  askedColor.value = true
  colorStore.setColorState(true)
}

const askDeleteTodo = () => {
  askedDelete.value = true
  deleteStore.setDeleteState(
    true,
    'Are you sure you want to delete this todo ?<br> Once the data is deleted, it cannot be recovered.'
  )
}

const deleteTodo = () => {
  emit('deleteTodo', props.index, props.subIndex)
}
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
        'bg-blue-400/50 hover:bg-blue-400/80': props.color === 3,
      }"
      @focus="$event.target && ($event.target as HTMLInputElement).select()"
      @input="emit('updatedTodo', props.index, props.subIndex, contentEdited, props.color)"
    />
    <button
      v-if="props.canShiftUp"
      class="btn secondary w-8 min-w-8 p-0"
      @click="emit('shiftTodo', props.index, props.subIndex, 'up')"
    >
      <ArrowUpToLine class="text-black dark:text-white" :size="20" />
    </button>
    <button
      v-if="props.canShiftDown"
      class="btn secondary w-8 min-w-8 p-0"
      @click="emit('shiftTodo', props.index, props.subIndex, 'down')"
    >
      <ArrowDownToLine class="text-black dark:text-white" :size="20" />
    </button>
    <button class="btn secondary w-8 min-w-8 p-0" @click="askColorTodo()">
      <Palette class="text-black dark:text-white" :size="20" />
    </button>
    <button class="btn secondary w-8 min-w-8 p-0" @click="askDeleteTodo()">
      <Trash2 class="text-black dark:text-white" :size="20" />
    </button>
  </div>
</template>
