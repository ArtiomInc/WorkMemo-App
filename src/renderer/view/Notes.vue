<script lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "/public/style/vue-quill.snow.css";
import DialogConfirm from "../components/DialogConfirm.vue";
import DialogError from "../components/DialogError.vue";
import { nextTick } from "vue";
export default {
  components: {
    QuillEditor,
    DialogConfirm,
    DialogError,
  },
  data() {
    return {
      noteList: null,
      selectedID: -1,
      noteTitle: "",
      noteContent: "",
      isEditingTitle: false,
      triggerDialogConfirm: false,
      triggerDialogError: false,
      contentDialogError: "An error occurred",
      Sortable: false,
    };
  },
  methods: {
    getNoteList() {
      window.electronAPI
        .setCommand(["getNoteList"])
        .then((result: any) => {
          this.noteList = result;
        })
        .catch((error: any) => {
          this.triggerDialogError = true;
          this.contentDialogError = error;
        });
    },
    addNoteList() {
      window.electronAPI
        .setCommand(["addNoteList"])
        .then((result: any) => {
          this.getNoteList();
        })
        .catch((error: any) => {
          this.triggerDialogError = true;
          this.contentDialogError = error;
        });
    },
    getNote(id: number) {
      this.selectedID = id;
      window.electronAPI
        .setCommand(["getNote", id])
        .then((result: any) => {
          this.noteTitle = result.title;
          this.noteContent = result.content;
        })
        .catch((error: any) => {
          this.triggerDialogError = true;
          this.contentDialogError = error;
        });
    },
    changeStateEdit(payload: boolean) {
      this.isEditingTitle = payload;
      if (!payload) {
        this.updateNoteTitle(this.selectedID, this.noteTitle);
        this.getNoteList();
      } else {
        nextTick(() => {
          //@ts-ignore
          this.$refs.titleinput.focus();
        });
      }
    },
    updateNoteTitle(id: number, content: string) {
      window.electronAPI
        .setCommand(["updateNoteTitle", id, content])
        .then((result: any) => {})
        .catch((error: any) => {
          this.triggerDialogError = true;
          this.contentDialogError = error;
        });
    },
    updateNoteContent() {
      window.electronAPI
        .setCommand(["updateNoteContent", this.selectedID, this.noteContent])
        .then((result: any) => {})
        .catch((error: any) => {
          this.triggerDialogError = true;
          this.contentDialogError = error;
        });
    },
    shiftNote(id: number, content: string) {
      this.selectedID = -1;
      window.electronAPI
        .setCommand(["shiftNote", id, content])
        .then((result: any) => {
          if (result == null) {
            this.getNoteList();
          } else {
            this.contentDialogError = result;
            this.triggerDialogError = true;
          }
        })
        .catch((error: any) => {
          this.contentDialogError = error;
          this.triggerDialogError = true;
        });
    },
    deleteRequest() {
      this.triggerDialogConfirm = true;
    },
    deleteNote(payload: boolean) {
      this.triggerDialogConfirm = false;
      if (payload && this.selectedID != -1) {
        window.electronAPI
          .setCommand(["deleteNote", this.selectedID])
          .then((result: any) => {
            this.selectedID = -1;
            this.getNoteList();
          })
          .catch((error: any) => {
            this.triggerDialogError = true;
            this.contentDialogError = error;
          });
      }
    },
    releaseDialogError() {
      this.triggerDialogError = false;
      this.contentDialogError = "An error occurred";
    },
  },
  mounted() {
    this.getNoteList();
  },
};
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ content: selectedID != -1, 'md:flex-row': selectedID != -1 }"
  >
    <div
      class="bg-white dark:bg-neutral-800 m-2 mt-0 p-2 rounded-lg drop-shadow h-full"
      :class="{
        'md:w-1/4': selectedID == -1,
        //@ts-ignore
        'md:w-1/4': selectedID != -1,
      }"
    >
      <ul v-if="noteList != null" v-for="(item, index) in noteList">
        <div
          class="flex items-center mb-2"
          :class="{
            //@ts-ignore
            'mb-0': index == noteList.length - 1,
          }"
        >
          <li
            class="select-none h-8 p-1 rounded flex w-full"
            :class="{
              'bg-stone-200 hover:bg-stone-300 dark:bg-neutral-900 dark:hover:dark:bg-neutral-950 hover:cursor-pointer':
                selectedID != index || selectedID == -1,
              'bg-neutral-400 dark:bg-neutral-950 hover:cursor-default':
                selectedID == index,
            }"
            @click="getNote(index)"
          >
            <span
              class="block text-ellipsis overflow-hidden whitespace-nowrap dark:text-neutral-200"
            >
              {{ item }}
            </span>
          </li>
          <button
            v-if="Sortable"
            class="ml-1 select-none h-8 aspect-square flex items-center justify-center bg-stone-200 dark:bg-neutral-900 p-1 mr-1 rounded hover:outline hover:outline-2 dark:outline-neutral-200"
            @click="shiftNote(index, 'up')"
          >
            <svg
              class="h-5 fill-neutral-800 dark:fill-neutral-200"
              viewBox="0 0 384 512"
            >
              <path
                d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
              />
            </svg>
          </button>
          <button
            v-if="Sortable"
            class="select-none h-8 aspect-square flex items-center justify-center bg-stone-200 dark:bg-neutral-900 p-1 rounded hover:outline hover:outline-2 dark:outline-neutral-200"
            @click="shiftNote(index, 'down')"
          >
            <svg
              class="h-5 fill-neutral-800 dark:fill-neutral-200"
              viewBox="0 0 384 512"
            >
              <path
                d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
              />
            </svg>
          </button>
        </div>
      </ul>
      <div class="">
        <button
          class="mt-2 mr-2 select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 px-3 py-1 rounded hover:outline hover:outline-2"
          @click="addNoteList"
        >
          Add note
        </button>
        <button
          class="mt-2 select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 px-3 py-1 rounded hover:outline hover:outline-2"
          @click="Sortable = !Sortable"
        >
          <span v-if="!Sortable">Sort order</span>
          <span v-if="Sortable">Finish order sorting</span>
        </button>
      </div>
    </div>
    <div
      v-if="selectedID != -1"
      :class="{ 'note-context-responsive': selectedID != -1 }"
      class="bg-white dark:bg-neutral-800 mx-2 mt-0 md:m-0 md:mr-2 p-2 h-full rounded-lg drop-shadow"
    >
      <div class="">
        <div class="flex items-center" v-if="isEditingTitle">
          <input
            ref="titleinput"
            class="h-8 m-0 pl-1 hover:outline focus:outline outline-1 rounded dark:bg-neutral-900 dark:text-neutral-200 outline-neutral-200"
            type="text"
            v-model="noteTitle"
            @keydown.enter="changeStateEdit(false)"
          />
          <button
            class="h-8 flex items-center select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2"
            @click="changeStateEdit(false)"
          >
            <svg
              class="h-5 fill-neutral-800 dark:fill-neutral-200"
              viewBox="0 0 448 512"
            >
              <path
                d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </svg>
          </button>
        </div>
        <div class="md:flex items-center" v-else>
          <span
            class="m-1 text-ellipsis overflow-hidden dark:text-neutral-200"
            >{{ noteTitle }}</span
          >
          <button
            class="h-8 flex items-center select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2 whitespace-nowrap"
            @click="changeStateEdit(true)"
          >
            <svg
              class="h-5 mr-2 fill-neutral-800 dark:fill-neutral-200"
              viewBox="0 0 512 512"
            >
              <path
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
              />
            </svg>
            Edit title
          </button>
          <button
            id="delete"
            class="h-8 flex items-center select-none bg-stone-200 dark:bg-neutral-900 dark:text-neutral-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2 whitespace-nowrap"
            @click="deleteRequest"
          >
            <svg
              class="h-5 mr-2 fill-neutral-800 dark:fill-neutral-200"
              viewBox="0 0 448 512"
            >
              <path
                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
              />
            </svg>
            Delete note
          </button>
        </div>
        <div class="mt-1">
          <QuillEditor
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
    @user-action="deleteNote"
  ></DialogConfirm>
  <DialogError
    v-if="triggerDialogError"
    :content="contentDialogError"
    @user-action="releaseDialogError"
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
