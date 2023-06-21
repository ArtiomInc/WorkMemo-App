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
      class="bg-white m-2 mt-0 p-2 rounded-lg drop-shadow h-full"
      :class="{
        'md:w-1/4': selectedID == -1,
        //@ts-ignore
        'md:w-1/4': selectedID != -1,
      }"
    >
      <ul
        class="select-none mb-2 h-8 p-1 rounded hover:cursor-pointer"
        :class="{
          'bg-stone-200': selectedID != index || selectedID == -1,
          'hover:bg-stone-300': selectedID != index || selectedID == -1,
          'bg-neutral-400': selectedID == index,
        }"
        v-if="noteList != null"
        v-for="(item, index) in noteList"
      >
        <li class="" @click="getNote(index)">
          <div class="text-ellipsis overflow-hidden">
            {{ item }}
          </div>
        </li>
      </ul>
      <div class="">
        <button
          class="select-none bg-stone-200 px-3 py-1 rounded hover:outline hover:outline-2"
          @click="addNoteList"
        >
          Add note
        </button>
      </div>
    </div>
    <div
      v-if="selectedID != -1"
      :class="{ 'note-context-responsive': selectedID != -1 }"
      class="bg-white mx-2 mt-0 md:m-0 md:mr-2 p-2 h-full rounded-lg drop-shadow"
    >
      <div class="">
        <div class="flex items-center" v-if="isEditingTitle">
          <input
            ref="titleinput"
            class="h-8 m-1 hover:outline focus:outline outline-1 rounded"
            type="text"
            v-model="noteTitle"
            @keydown.enter="changeStateEdit(false)"
          />
          <button
            class="h-8 flex items-center select-none bg-stone-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2"
            @click="changeStateEdit(false)"
          >
            <img class="h-5" src="/public/images/check-solid.svg" />
          </button>
        </div>
        <div class="md:flex items-center" v-else>
          <span class="m-1 text-ellipsis overflow-hidden">{{ noteTitle }}</span>
          <button
            class="h-8 flex items-center select-none bg-stone-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2 whitespace-nowrap"
            @click="changeStateEdit(true)"
          >
            <img class="h-5 mr-2" src="/public/images/pen-solid.svg" />
            Edit title
          </button>
          <button
            id="delete"
            class="h-8 flex items-center select-none bg-stone-200 m-1 px-3 py-1 rounded hover:outline hover:outline-2 whitespace-nowrap"
            @click="deleteRequest"
          >
            <img class="h-5 mr-2" src="/public/images/trash-can-solid.svg" />
            Delete note
          </button>
        </div>
        <div class="mt-1">
          <QuillEditor
            toolbar="minimal"
            contentType="html"
            v-model:content="noteContent"
            @update:content="updateNoteContent"
            class="custom-quill-editor"
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
