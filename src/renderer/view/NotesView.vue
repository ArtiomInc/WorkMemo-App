<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import {
  ArrowDownToLine,
  ArrowDownWideNarrow,
  ArrowUpToLine,
  Check,
  Palette,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-vue-next'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'
import { nextTick, onMounted, ref, Ref, watch } from 'vue'

import { NoteCommands } from '../../main/static/NoteCommands'
import '../assets/quill.css'
import NavBar from '../components/NavBar.vue'
import { useColorStore } from '../stores/DialogColor'
import { useDeleteStore } from '../stores/DialogDelete'
import { useErrorStore } from '../stores/DialogError'

interface NoteList {
  title: string
  color: number
}

interface Note {
  id: number
  title: string
  content: string
  color: number
}

const errorStore = useErrorStore()
const colorStore = useColorStore()
const deleteStore = useDeleteStore()
const askedColor = ref(false)
const askedDelete = ref(false)
const noteList: Ref<NoteList[] | undefined> = ref(undefined)
const noteDetails: Ref<Note | undefined> = ref(undefined)
const selectedID = ref(-1)
const isEditingTitle = ref(false)
const sortable = ref(false)
const titleinput: Ref<HTMLElement | null> = ref(document.getElementById('titleinput'))

watch(
  () => deleteStore.deleteState,
  (value: boolean) => {
    if (value === false && deleteStore.deleteLastResultAction === true && askedDelete.value === true) {
      deleteNote()
      deleteStore.setDeleteLastResult(false)
    }
    if (value === false) {
      askedDelete.value = false
    }
  }
)

watch(
  () => colorStore.colorState,
  (value: boolean) => {
    if (value === false && colorStore.colorLastResultAction === true && askedColor.value === true) {
      updateNoteColor(colorStore.colorLastChoice)
      colorStore.setColorLastChoice(-1)
      colorStore.setColorLastResult(false)
    }
    if (value === false) {
      askedColor.value = false
    }
  }
)

const getListNote = () => {
  window.electronAPI
    .setCommand([NoteCommands.GET_NOTE_LIST])
    .then((result: NoteList[]) => {
      noteList.value = result
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const addNewNote = () => {
  window.electronAPI
    .setCommand([NoteCommands.ADD_NEW_NOTE])
    .then(() => {
      getListNote()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const getDetailsNote = (id: number) => {
  selectedID.value = id
  window.electronAPI
    .setCommand([NoteCommands.GET_NOTE_DETAILS, id])
    .then((result: Note) => {
      noteDetails.value = result
    })
    .catch((error: any) => {
      selectedID.value = -1
      noteDetails.value = undefined
      errorStore.setErrorState(true, error.message)
    })
}

const toggleEditTitle = (payload: boolean) => {
  isEditingTitle.value = payload
  if (!payload && noteDetails.value) {
    updateTitleNote(selectedID.value, noteDetails.value?.title)
    getListNote()
  } else {
    nextTick(() => {
      if (titleinput.value) {
        titleinput.value.focus()
      }
    })
  }
}

const updateTitleNote = (id: number, content: string) => {
  window.electronAPI
    .setCommand([NoteCommands.UPDATE_NOTE_TITLE, id, content])
    .then(() => {})
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const updateNoteContent = () => {
  if (noteDetails.value) {
    window.electronAPI
      .setCommand([NoteCommands.UPDATE_NOTE_CONTENT, selectedID.value, noteDetails.value?.content])
      .then(() => {})
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  }
}

const colorRequest = () => {
  askedColor.value = true
  colorStore.setColorState(true)
}

const updateNoteColor = (color: number) => {
  if (color >= 0 && color <= 3) {
    window.electronAPI
      .setCommand([NoteCommands.UPDATE_NOTE_COLOR, selectedID.value, color])
      .then(() => {
        getListNote()
      })
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  } else {
    errorStore.setErrorState(true, "Color choosed doesn't exist")
  }
}

const shiftNote = (id: number, direction: string) => {
  selectedID.value = -1
  noteDetails.value = undefined
  window.electronAPI
    .setCommand([NoteCommands.SHIFT_NOTE, id, direction])
    .then(() => {
      getListNote()
    })
    .catch((error: any) => {
      errorStore.setErrorState(true, error.message)
    })
}

const deleteRequest = () => {
  askedDelete.value = true
  deleteStore.setDeleteState(
    true,
    'Are you sure you want to delete this note ?<br> Once the data is deleted, it cannot be recovered.'
  )
}

const deleteNote = () => {
  if (selectedID.value != -1) {
    window.electronAPI
      .setCommand([NoteCommands.DELETE_NOTE, selectedID.value])
      .then(() => {
        selectedID.value = -1
        noteDetails.value = undefined
        getListNote()
      })
      .catch((error: any) => {
        errorStore.setErrorState(true, error.message)
      })
  }
}

onMounted(async () => {
  getListNote()
})
</script>

<template>
  <div class="flex flex-col">
    <NavBar></NavBar>
    <div class="flex flex-col" :class="{ content: selectedID != -1, 'md:flex-row': selectedID != -1 }">
      <div
        class="card m-2 h-full overflow-y-auto"
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
                class="input w-full justify-start border-0"
                :class="{
                  'hover:cursor-pointer': selectedID != index || selectedID == -1,
                  'hover:cursor-default': selectedID == index,
                  'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20': item.color == 0,
                  'bg-red-400/50 hover:bg-red-400/80': item.color == 1,
                  'bg-green-400/50 hover:bg-green-400/80': item.color == 2,
                  'bg-blue-400/50 hover:bg-blue-400/80': item.color == 3,
                }"
                @click="getDetailsNote(index)"
              >
                <span class="block dark:text-neutral-200">
                  {{ item.title }}
                </span>
              </div>
              <button
                v-if="sortable && index != 0"
                class="btn secondary group w-8 min-w-8 p-0"
                @click="shiftNote(index, 'up')"
              >
                <ArrowUpToLine class="text-black group-hover:animate-wiggle dark:text-white" :size="20" />
              </button>
              <button
                v-if="sortable && index != noteList.length - 1"
                class="btn secondary group w-8 min-w-8 p-0"
                @click="shiftNote(index, 'down')"
              >
                <ArrowDownToLine class="text-black group-hover:animate-wiggle dark:text-white" :size="20" />
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row">
          <button class="btn secondary group" @click="addNewNote">
            <Plus
              class="text-black transition-transform duration-100 group-hover:rotate-90 dark:text-white"
              :size="20"
            />note
          </button>
          <button class="btn secondary group" @click="sortable = !sortable">
            <ArrowDownWideNarrow
              class="text-black transition-transform duration-100 group-hover:rotate-180 dark:text-white"
              :size="20"
            />sort
          </button>
        </div>
      </div>
      <div
        v-if="selectedID != -1 && noteDetails != undefined"
        :class="{ 'note-context-responsive': selectedID != -1 }"
        class="card mx-2 mb-2 mt-0 h-full md:m-0 md:mr-2 md:mt-2"
      >
        <div class="">
          <div v-if="isEditingTitle" class="flex items-center gap-1">
            <input
              ref="titleinput"
              v-model="noteDetails.title"
              class="input secondary"
              type="text"
              @keydown.enter="toggleEditTitle(false)"
            />
            <button class="btn secondary group w-8 min-w-8 p-0" @click="toggleEditTitle(false)">
              <Check class="text-black group-hover:animate-pulse dark:text-white" :size="20" />
            </button>
          </div>
          <div v-else class="flex flex-col gap-1 md:flex-row">
            <span
              class="input cursor-pointer border border-black/10 dark:border-white/10"
              :class="{
                'bg-black/10 dark:bg-white/10': noteDetails.color == 0,
                'bg-red-400/50': noteDetails.color == 1,
                'bg-green-400/50': noteDetails.color == 2,
                'bg-blue-400/50': noteDetails.color == 3,
              }"
              @click="toggleEditTitle(true)"
              >{{ noteDetails.title }}</span
            >
            <button class="btn secondary group" @click="toggleEditTitle(true)">
              <Pencil class="text-black transition-transform group-hover:rotate-[-45deg] dark:text-white" :size="20" />
              Edit title
            </button>
            <button class="btn secondary group md:w-8 md:min-w-8 md:p-0" @click="colorRequest">
              <Palette class="text-black transition-transform group-hover:rotate-[-45deg] dark:text-white" :size="20" />
            </button>
            <button id="delete" class="btn secondary group" @click="deleteRequest">
              <Trash2 class="text-black transition-transform group-hover:rotate-[25deg] dark:text-white" :size="20" />
              <p>Delete note</p>
            </button>
          </div>
          <div class="mt-1">
            <QuillEditor
              v-model:content="noteDetails.content"
              spellcheck="false"
              :toolbar="[
                [{ header: 1 }, { header: 2 }],
                ['bold', 'italic', 'underline'],
                [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
              ]"
              :modules="{
                name: 'blotFormatter',
                module: BlotFormatter,
                options: {},
              }"
              content-type="html"
              placeholder="Type your note here"
              @update:content="updateNoteContent"
            ></QuillEditor>
          </div>
        </div>
      </div>
    </div>
  </div>
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
