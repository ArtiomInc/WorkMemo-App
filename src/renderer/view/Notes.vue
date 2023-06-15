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
  <div :class="{ content: selectedID != -1 }">
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
          <button id="delete" class="button text-red" @click="deleteRequest">
            Delete note
          </button>
        </div>
        <div class="editor">
          <QuillEditor
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
.content {
  margin: 0;
  padding: 0;
  display: flex;
}

.sidebar-splitted {
  width: 30%;
  max-width: 400px;
  min-width: 200px;
  height: 100%;
}
.card-focus-note {
  margin-left: 0;
}
.focus-note {
  width: 100%;
}
.content-is-true {
  display: flex;
  align-items: center;
}

.content-is-false {
  display: flex;
  align-items: center;
}

.card {
  margin-top: 0;
}

.list-of-note {
  list-style: none;
}
.preview-note {
  margin-bottom: 5px;
  padding: 3px;
  border-radius: 5px;
  cursor: pointer;
}
.preview-note:hover {
  background: rgba(0, 0, 0, 0.1);
}
.preview-note.is-active {
  background: rgba(0, 0, 0, 0.2);
}
.preview-note-title {
  line-height: 1em;
  font-weight: 700;
  font-size: 1.5em;
  padding: 5px 0;
  display: flex;
  align-items: end;
}

.tags:not(:first-child) {
  margin-left: 5px;
}

.input {
  margin: 1px;
  width: calc(100% - 15px);
}
.editor {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 6px;
}

.content-is-false > span {
  font-weight: 800;
  font-size: 1.3em;
  margin-left: 5px;
}

.edit-tag {
  display: flex;
}
.custom-input {
  outline: 0;
  border: 0;
  padding: 2px;
  padding-left: 6px;
  padding-right: 6px;
  margin-right: 5px;
  border-radius: 13px;
  font-size: 0.9em;
  font-family: GitlabSans;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}

.button-custom {
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 10px;
}

.img-and-text > img {
  margin-right: 10px;
}

.button > img {
  height: 50%;
  filter: var(--color-img);
}

#delete {
  margin-left: 10px;
}
@media screen and (max-width: 700px) {
  .content {
    display: block;
  }
  .sidebar-splitted {
    width: inherit;
    max-width: inherit;
    min-width: inherit;
    height: 100%;
  }
  .card-focus-note {
    margin-left: 10px;
  }
  .content-is-false {
    display: block;
    padding: 0;
  }
  .button-custom,
  #delete {
    margin: 0 0 0 0;
    width: 100%;
  }
  #delete {
    margin-top: 5px;
  }
}
</style>
