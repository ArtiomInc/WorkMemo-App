<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill';
import '/public/style/vue-quill.snow.css';
import DialogConfirm from '../components/DialogConfirm.vue';
import DialogColor from '../components/DialogColor.vue';
import DialogError from '../components/DialogError.vue';
import { ipcMainControl } from '../../main/static/ipcMainControl';
import { ref, Ref, onMounted, nextTick } from 'vue';

let noteList: Ref<{ title: string; content: string; color: number }[]> = ref(
  []
);
let selectedID: Ref<number> = ref(-1);
let noteTitle: Ref<string> = ref('');
let noteContent: Ref<string> = ref('');
let isEditingTitle: Ref<boolean> = ref(false);
let triggerDialogConfirm: Ref<boolean> = ref(false);
let triggerDialogColor: Ref<boolean> = ref(false);
let triggerDialogError: Ref<boolean> = ref(false);
let contentDialogError: Ref<string> = ref('An error occurred');
let sortable: Ref<boolean> = ref(false);
const titleinput: Ref<HTMLElement | null> = ref(
  document.getElementById('titleinput')
);

const getNoteList = () => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_GET_LIST])
    .then((result: any) => {
      noteList.value = result;
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const addNoteList = () => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_ADD])
    .then(() => {
      getNoteList();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const getNote = (id: number) => {
  selectedID.value = id;
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_GET, id])
    .then((result: any) => {
      noteTitle.value = result.title;
      noteContent.value = result.content;
    })
    .catch((error: any) => {
      selectedID.value = -1;
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const changeStateEdit = (payload: boolean) => {
  isEditingTitle.value = payload;
  if (!payload) {
    updateNoteTitle(selectedID.value, noteTitle.value);
    getNoteList();
  } else {
    nextTick(() => {
      if (titleinput.value) {
        titleinput.value.focus();
      }
    });
  }
};

const updateNoteTitle = (id: number, content: string) => {
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_UPDATE_TITLE, id, content])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const colorRequest = () => {
  triggerDialogColor.value = true;
};

const updateNoteColor = (color: number) => {
  if (color >= 0) {
    window.electronAPI
      .setCommand([ipcMainControl.NOTE_UPDATE_COLOR, selectedID.value, color])
      .then((result: any) => {
        selectedID.value = -1;
        getNoteList();
      })
      .catch((error: any) => {
        triggerDialogError.value = true;
        contentDialogError.value = error.message;
      });
  } else {
    triggerDialogError.value = true;
    contentDialogError.value = "Color choosed doesn't exist";
  }
  triggerDialogColor.value = false;
};

const updateNoteContent = () => {
  window.electronAPI
    .setCommand([
      ipcMainControl.NOTE_UPDATE_CONTENT,
      selectedID.value,
      noteContent.value,
    ])
    .then(() => {})
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const shiftNote = (id: number, content: string) => {
  selectedID.value = -1;
  window.electronAPI
    .setCommand([ipcMainControl.NOTE_SHIFT, id, content])
    .then((result: any) => {
      getNoteList();
    })
    .catch((error: any) => {
      triggerDialogError.value = true;
      contentDialogError.value = error.message;
    });
};

const deleteRequest = () => {
  triggerDialogConfirm.value = true;
};

const deleteNote = () => {
  triggerDialogConfirm.value = false;
  if (selectedID.value != -1) {
    window.electronAPI
      .setCommand([ipcMainControl.NOTE_DELETE, selectedID.value])
      .then((result: any) => {
        selectedID.value = -1;
        getNoteList();
      })
      .catch((error: any) => {
        triggerDialogError.value = true;
        contentDialogError.value = error.message;
      });
  }
};

const releaseDialogError = () => {
  triggerDialogError.value = false;
  contentDialogError.value = 'An error occurred';
};

onMounted(async () => {
  getNoteList();
});
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ content: selectedID != -1, 'md:flex-row': selectedID != -1 }"
  >
    <div
      class="bg-white dark:bg-neutral-800 m-2 mt-0 p-2 rounded-lg drop-shadow h-full overflow-y-auto"
      :class="{
        'md:w-1/4': selectedID != -1,
      }"
    >
      <div class="md:max-h-[calc(100vh-145px)] overflow-y-auto">
        <div
          v-if="noteList != null"
          v-for="(item, index) in noteList"
          class="mb-2"
        >
          <div
            class="flex items-center"
            :class="{
              'mb-2': index != noteList.length - 1,
              'mb-0': index == noteList.length - 1,
            }"
          >
            <div
              class="select-none h-8 p-1 rounded flex w-full truncate"
              :class="{
                'hover:cursor-pointer': selectedID != index || selectedID == -1,
                'hover:cursor-default': selectedID == index,
                'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20':
                  item.color == 0,
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
            <button
              v-if="sortable && index != 0"
              class="btn-primary icon ml-1"
              @click="shiftNote(index, 'up')"
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
              v-if="sortable && index != noteList.length - 1"
              class="btn-primary icon ml-1"
              @click="shiftNote(index, 'down')"
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
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row">
        <button class="btn-primary text sm:mr-1" @click="addNoteList">
          Add note
        </button>
        <button
          class="mt-1 sm:mt-0 btn-primary text"
          @click="sortable = !sortable"
        >
          <span v-if="!sortable">Sort order</span>
          <span v-if="sortable">Finish order sorting</span>
        </button>
      </div>
    </div>
    <div
      v-if="selectedID != -1"
      :class="{ 'note-context-responsive': selectedID != -1 }"
      class="bg-white dark:bg-neutral-800 mx-2 mt-0 md:m-0 md:mr-2 mb-2 p-2 h-full rounded-lg drop-shadow"
    >
      <div class="">
        <div class="flex items-center mb-2" v-if="isEditingTitle">
          <input
            ref="titleinput"
            class="h-8 m-0 mr-1 px-2 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 dark:text-neutral-200 outline-none"
            type="text"
            v-model="noteTitle"
            @keydown.enter="changeStateEdit(false)"
          />
          <button class="btn-primary icon" @click="changeStateEdit(false)">
            <img class="hidden dark:block" src="../assets/done_white.svg" />
            <img class="block dark:hidden" src="../assets/done_black.svg" />
          </button>
        </div>
        <div class="md:flex items-center mb-2" v-else>
          <span
            class="px-2 py-1 flex items-center h-8 md:mr-1 border border-black/10 dark:border-white/10 rounded"
            :class="{
              'bg-black/10 dark:bg-white/10': noteList[selectedID].color == 0,
              'bg-red-400/50': noteList[selectedID].color == 1,
              'bg-green-400/50': noteList[selectedID].color == 2,
              'bg-blue-400/50': noteList[selectedID].color == 3,
            }"
            @click="changeStateEdit(true)"
            >{{ noteTitle }}</span
          >
          <button
            class="btn-primary icon-text w-full md:w-auto md:mr-1 mt-1 md:mt-0"
            @click="changeStateEdit(true)"
          >
            <img
              class="hidden dark:block h-5 mr-0.5"
              src="../assets/edit_white.svg"
            />
            <img
              class="block dark:hidden h-5 mr-0.5"
              src="../assets/edit_black.svg"
            />
            Edit title
          </button>
          <button
            class="btn-primary icon w-full md:w-auto md:mr-1 h-[34px] mt-1 md:mt-0"
            @click="colorRequest"
          >
            <img class="hidden dark:block" src="../assets/palette_white.svg" />
            <img class="block dark:hidden" src="../assets/palette_black.svg" />
          </button>
          <button
            id="delete"
            class="btn-primary icon-text w-full md:w-auto mt-1 md:mt-0"
            @click="deleteRequest"
          >
            <img
              class="hidden dark:block h-5 mr-0.5"
              src="../assets/delete_white.svg"
            />
            <img
              class="block dark:hidden h-5 mr-0.5"
              src="../assets/delete_black.svg"
            />
            <p>Delete note</p>
          </button>
        </div>
        <div class="mt-1">
          <QuillEditor
            spellcheck="false"
            toolbar="minimal"
            contentType="html"
            placeholder="Type your note here"
            v-model:content="noteContent"
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
  <DialogColor
    v-if="triggerDialogColor"
    @user-action="updateNoteColor"
    @cancel="triggerDialogColor = false"
  >
  </DialogColor>
  <DialogError
    v-if="triggerDialogError"
    :content="contentDialogError"
    @cancel="releaseDialogError"
  ></DialogError>
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
