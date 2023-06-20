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
  <div class="bg-white m-2 p-2 rounded-lg" :class="{ content: selectedID != -1 }">
    <div
      class="card"
      :class="{
        'sidebar-splitted': selectedID != -1,
      }"
    >
      <ul
        class="list-of-note"
        v-if="noteList != null"
        v-for="(item, index) in noteList"
      >
        <li
          class="preview-note"
          :class="{ 'is-active': selectedID == index }"
          @click="getNote(index)"
        >
          <div class="preview-note-title">
            {{ item }}
          </div>
        </li>
      </ul>
      <div class="user-action">
        <button class="button is-fullwidth" @click="addNoteList">
          Add note
        </button>
      </div>
    </div>
    <div v-if="selectedID != -1" class="focus-note">
      <div class="card card-focus-note">
        <div class="content-is-true" v-if="isEditingTitle">
          <input
            ref="titleinput"
            class="input is-fullwidth"
            type="text"
            v-model="noteTitle"
            @keydown.enter="changeStateEdit(false)"
          />
          <button class="button button-custom" @click="changeStateEdit(false)">
            <img src="/public/images/check-solid.svg" />
          </button>
        </div>
        <div class="content-is-false" v-else>
          <span>{{ noteTitle }}</span>
          <button
            class="button button-custom img-and-text"
            @click="changeStateEdit(true)"
          >
            <img src="/public/images/pen-solid.svg" />
            Edit title
          </button>
          <button
            id="delete"
            class="button button-custom img-and-text text-red"
            @click="deleteRequest"
          >
            <img src="/public/images/trash-can-solid.svg" />
            Delete note
          </button>
        </div>
        <div class="editor">
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

</style>
