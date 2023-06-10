<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { QuillEditor } from "@vueup/vue-quill";
import "/public/style/vue-quill.snow.css";
export default {
  computed: {
    ...mapGetters(["getDialogReturn"]),
  },
  components: {
    QuillEditor,
  },
  data() {
    return {
      noteList: null,
      idNoteSelect: -1,
      noteTitle: "",
      noteContent: "",
      apiResponse: null,
      isEditingTitle: false,
      checkingEndOfDialog: 0,
    };
  },
  methods: {
    ...mapMutations([
      "setDialogTrigger",
      "setDialogTitle",
      "setDialogContent",
      "setDialogReturn",
    ]),
    openDialog() {
      this.setDialogTrigger(true);
      this.setDialogTitle("Delete note ?");
      this.setDialogContent(
        "Are you sure you want to delete this note ?<br/>Impossible to recover after delete"
      );
    },
    selectNote(payload: number) {
      this.idNoteSelect = payload;
      this.getNote(payload);
    },
    changeStateEdit(payload: boolean) {
      this.isEditingTitle = payload;
      if (!payload) {
        this.updateNoteTitle(this.idNoteSelect, this.noteTitle);
        this.getNoteList();
      }
    },
    getNoteList() {
      window.electronAPI
        .setCommand(["getNoteList"])
        .then((result: any) => {
          this.noteList = result;
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from getNoteList");
          this.setDialogContent(error);
        });
    },
    addNoteList() {
      window.electronAPI
        .setCommand(["addNoteList"])
        .then((result: any) => {
          this.getNoteList();
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from addNoteList");
          this.setDialogContent(error);
        });
    },
    getNote(id: number) {
      window.electronAPI
        .setCommand(["getNote", id])
        .then((result: any) => {
          this.noteTitle = result.title;
          this.noteContent = result.content;
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from getNote");
          this.setDialogContent(error);
        });
    },
    updateNoteTitle(id: number, content: string) {
      window.electronAPI
        .setCommand(["updateNoteTitle", id, content])
        .then((result: any) => {})
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from updateNoteTitle");
          this.setDialogContent(error);
        });
    },
    updateNoteContent() {
      const id = this.idNoteSelect;
      const content = this.noteContent;
      window.electronAPI
        .setCommand(["updateNoteContent", id, content])
        .then((result: any) => {})
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from updateNoteContent");
          this.setDialogContent(error);
        });
    },
    deleteRequest() {
      this.setDialogTrigger(true);
      this.setDialogTitle("Delete note ?");
      this.setDialogContent(
        "Are you sure you want to delete this note ? </br>Once deleted, it will be impossible to recover."
      );
      this.checkingEndOfDialog = setInterval(() => {
        if (this.getDialogReturn === "cancelled") {
          console.log(this.getDialogReturn);
          this.setDialogReturn("");
          clearInterval(this.checkingEndOfDialog);
        } else if (this.getDialogReturn === "deleted") {
          console.log(this.getDialogReturn);
          this.setDialogReturn("");
          this.deleteNote(this.idNoteSelect);
          clearInterval(this.checkingEndOfDialog);
        }
        const read = this.getDialogReturn;
      }, 100);
    },
    deleteNote(id: number) {
      window.electronAPI
        .setCommand(["deleteNote", id])
        .then((result: any) => {
          this.idNoteSelect = -1;
          this.getNoteList();
        })
        .catch((error: any) => {
          this.apiResponse = error;
          this.setDialogTrigger(true);
          this.setDialogTitle("Error from deleteNote");
          this.setDialogContent(error);
        });
    },
  },
  mounted() {
    this.getNoteList();
  },
};
</script>

<template>
  <div :class="{ content: idNoteSelect != -1 }">
    <div
      class="card"
      :class="{
        'sidebar-splitted': idNoteSelect != -1,
      }"
    >
      <ul
        class="list-of-note"
        v-if="noteList != null"
        v-for="(item, index) in noteList"
      >
        <li
          class="preview-note"
          :class="{ 'is-active': idNoteSelect == index }"
          @click="selectNote(index)"
        >
          <div class="preview-note-title">
            {{ item }}
          </div>
        </li>
      </ul>
      <div class="user-action">
        <button class="button is-fullwidth" @click="addNoteList">Add</button>
      </div>
    </div>
    <div v-if="idNoteSelect != -1" class="focus-note">
      <div class="card card-focus-note">
        <div class="content-is-true" v-if="isEditingTitle">
          <input class="input is-fullwidth" type="text" v-model="noteTitle" />
          <button class="button" @click="changeStateEdit(false)">
            <img src="/public/images/check-solid.svg" />
          </button>
        </div>
        <div class="content-is-false" v-else>
          <span>{{ noteTitle }}</span>
          <button class="button" @click="changeStateEdit(true)">
            <img src="/public/images/pen-solid.svg" />
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
        <button class="button is-fullwidth text-red" @click="deleteRequest()">
          Delete
        </button>
      </div>
    </div>
  </div>
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

.card {
  margin-top: 0;
}
.card-focus-note {
  margin-left: 0;
}
.focus-note {
  width: 100%;
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

.rightcontent {
  height: 100%;
  width: 100%;
  min-width: 200px;
  position: relative;
  overflow-x: auto;
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
.button {
  margin: 1px;
  width: calc(100% - 2px);
  margin-bottom: 5px;
}

.content-is-true {
  display: flex;
}
.content-is-true > button {
  height: 35px;
  width: 35px;
  margin-left: 8px;
  margin-bottom: 1px;
}
.content-is-true > button > img {
  height: 100%;
}

.content-is-false {
  display: flex;
  align-items: center;
}
.content-is-false > span {
  font-weight: 800;
  font-size: 1.3em;
  margin-left: 5px;
}
.content-is-false > button {
  height: 25px;
  width: 25px;
  margin-left: 10px;
  margin-bottom: 1px;
}
.content-is-false > button > img {
  height: 100%;
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
</style>
