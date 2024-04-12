<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import { ArrowDownToLine, ArrowUpToLine, Check, Palette, PencilLine, Trash2 } from 'lucide-vue-next'
import { nextTick, onMounted, ref, Ref } from 'vue'

import { ipcMainControl } from '../../main/static/ipcMainControl'
import DialogColor from '../components/DialogColor.vue'
import DialogConfirm from '../components/DialogConfirm.vue'
import DialogError from '../components/DialogError.vue'

import '/public/style/vue-quill.snow.css'

const noteList: Ref<{ title: string; content: string; color: number }[]> = ref([])
const selectedID: Ref<number> = ref(-1)
const noteTitle: Ref<string> = ref('')
const noteContent: Ref<string> = ref('')
const isEditingTitle: Ref<boolean> = ref(false)
const triggerDialogConfirm: Ref<boolean> = ref(false)
const triggerDialogColor: Ref<boolean> = ref(false)
const triggerDialogError: Ref<boolean> = ref(false)
const contentDialogError: Ref<string> = ref('An error occurred')
const sortable: Ref<boolean> = ref(false)
const titleinput: Ref<HTMLElement | null> = ref(document.getElementById('titleinput'))

const getNoteList = () => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_GET_LIST])
    .then((result: any) => {
      noteList.value = result
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const addNoteList = () => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_ADD])
    .then(() => {
      getNoteList()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const getNote = (id: number) => {
  selectedID.value = id
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_GET, id])
    .then((result: any) => {
      noteTitle.value = result.title
      noteContent.value = result.content
    })
    .catch((error: any) => {
      selectedID.value = -1
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const changeStateEdit = (payload: boolean) => {
  isEditingTitle.value = payload
  if (!payload) {
    updateNoteTitle(selectedID.value, noteTitle.value)
    getNoteList()
  } else {
    nextTick(() => {
      if (titleinput.value) {
        titleinput.value.focus()
      }
    })
  }
}

const updateNoteTitle = (id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_UPDATE_TITLE, id, content])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const colorRequest = () => {
  triggerDialogColor.value = true
}

const updateNoteColor = (color: number) => {
  if (color >= 0) {
    window.electronAPI
      .setCommand([ipcMainControl.NOTE_UPDATE_COLOR, selectedID.value, color])
      .then(() => {
        selectedID.value = -1
        getNoteList()
      })
      .catch((error: any) => {
        triggerDialogError.value = true
        contentDialogError.value = error.message
      })
  } else {
    triggerDialogError.value = true
    contentDialogError.value = "Color choosed doesn't exist"
  }
  triggerDialogColor.value = false
}

const updateNoteContent = () => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_UPDATE_CONTENT, selectedID.value, noteContent.value])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const shiftNote = (id: number, content: string) => {
  selectedID.value = -1
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_SHIFT, id, content])
    .then(() => {
      getNoteList()
    })
    .catch((error: any) => {
      triggerDialogError.value = true
      contentDialogError.value = error.message
    })
}

const deleteRequest = () => {
  triggerDialogConfirm.value = true
}

const deleteNote = () => {
  triggerDialogConfirm.value = false
  if (selectedID.value != -1) {
    window.electronAPI
      .setCommand([ipcMainControl.NOTE_DELETE, selectedID.value])
      .then(() => {
        selectedID.value = -1
        getNoteList()
      })
      .catch((error: any) => {
        triggerDialogError.value = true
        contentDialogError.value = error.message
      })
  }
}

const releaseDialogError = () => {
  triggerDialogError.value = false
  contentDialogError.value = 'An error occurred'
}

onMounted(async () => {
  getNoteList()
})
</script>

<template>
  <div class="flex flex-col" :class="{ content: selectedID != -1, 'md:flex-row': selectedID != -1 }">
    <div
      class="m-2 mt-0 h-full overflow-y-auto rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800"
      :class="{
        'md:w-1/4': selectedID != -1,
      }"
    >
      <div v-if="noteList != null" class="overflow-y-auto md:max-h-[calc(100vh-145px)]">
        <div v-for="(item, index) in noteList" :key="index" class="mb-2">
          <div
            class="flex items-center gap-1"
            :class="{
              'mb-2': index != noteList.length - 1,
              'mb-0': index == noteList.length - 1,
            }"
          >
            <div
              class="flex h-8 w-full select-none truncate rounded p-1"
              :class="{
                'hover:cursor-pointer': selectedID != index || selectedID == -1,
                'hover:cursor-default': selectedID == index,
                'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20': item.color == 0,
                'bg-red-400/50 hover:bg-red-400/80': item.color == 1,
                'bg-green-400/50 hover:bg-green-400/80': item.color == 2,
                'bg-blue-400/50 hover:bg-blue-400/80': item.color == 3,
              }"
              @click="getNote(index)"
            >
              <span class="block dark:text-neutral-200">
                {{ item.title }}
              </span>
            </div>
            <button v-if="sortable && index != 0" class="btn primary" @click="shiftNote(index, 'up')">
              <ArrowUpToLine class="text-black dark:text-white" :size="20" />
            </button>
            <button
              v-if="sortable && index != noteList.length - 1"
              class="btn primary"
              @click="shiftNote(index, 'down')"
            >
              <ArrowDownToLine class="text-black dark:text-white" :size="20" />
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 sm:flex-row">
        <button class="btn primary" @click="addNoteList">Add note</button>
        <button class="btn primary" @click="sortable = !sortable">
          <span v-if="!sortable">Sort order</span>
          <span v-if="sortable">Finish order sorting</span>
        </button>
      </div>
    </div>
    <div
      v-if="selectedID != -1"
      :class="{ 'note-context-responsive': selectedID != -1 }"
      class="mx-2 mb-2 mt-0 h-full rounded-lg bg-white p-2 drop-shadow dark:bg-neutral-800 md:m-0 md:mr-2"
    >
      <div class="">
        <div v-if="isEditingTitle" class="flex items-center gap-1">
          <input
            ref="titleinput"
            v-model="noteTitle"
            class="h-8 rounded border border-black/10 bg-black/10 px-2 outline-none dark:border-white/10 dark:bg-white/10 dark:text-neutral-200"
            type="text"
            @keydown.enter="changeStateEdit(false)"
          />
          <button class="btn primary" @click="changeStateEdit(false)">
            <Check class="text-black dark:text-white" :size="20" />
          </button>
        </div>
        <div v-else class="flex flex-col gap-1 md:flex-row">
          <span
            class="flex h-8 cursor-pointer items-center rounded border border-black/10 px-2 py-1 dark:border-white/10"
            :class="{
              'bg-black/10 dark:bg-white/10': noteList[selectedID].color == 0,
              'bg-red-400/50': noteList[selectedID].color == 1,
              'bg-green-400/50': noteList[selectedID].color == 2,
              'bg-blue-400/50': noteList[selectedID].color == 3,
            }"
            @click="changeStateEdit(true)"
            >{{ noteTitle }}</span
          >
          <button class="btn primary" @click="changeStateEdit(true)">
            <PencilLine class="text-black dark:text-white" :size="20" />
            Edit title
          </button>
          <button class="btn primary" @click="colorRequest">
            <Palette class="text-black dark:text-white" :size="20" />
          </button>
          <button id="delete" class="btn primary" @click="deleteRequest">
            <Trash2 class="text-black dark:text-white" :size="20" />
            <p>Delete note</p>
          </button>
        </div>
        <div class="mt-1">
          <QuillEditor
            v-model:content="noteContent"
            spellcheck="false"
            toolbar="minimal"
            content-type="html"
            placeholder="Type your note here"
            @update:content="updateNoteContent"
          ></QuillEditor>
        </div>
      </div>
    </div>
  </div>
  <DialogConfirm
    v-if="triggerDialogConfirm"
    title="Delete note ?"
    content="Are you sure you want to delete this note ?<br/>Impossible to recover after delete"
    @delete="deleteNote"
    @cancel="triggerDialogConfirm = false"
  ></DialogConfirm>
  <DialogColor v-if="triggerDialogColor" @user-action="updateNoteColor" @cancel="triggerDialogColor = false">
  </DialogColor>
  <DialogError v-if="triggerDialogError" :content="contentDialogError" @cancel="releaseDialogError"></DialogError>
</template>

<style scoped>
.note-context-responsive {
  width: calc(100% - 1rem);
}
@media (min-width: 768px) {
  .note-context-responsive {
    width: calc(100% - 25% - 1.5rem);
  }
}
</style>
