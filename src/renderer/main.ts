import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";
import "./style.css";
import App from "./App.vue";
import Todos from "./view/Todos.vue";
import Notes from "./view/Notes.vue";
import HtmlFrameVue from "./view/HtmlFrame.vue";

// Vuejs instance
const app = createApp(App);

// Vue-router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Todos", component: Todos },
    { path: "/notes", name: "Notes", component: Notes },
    { path: "/tags", name: "Tags", component: HtmlFrameVue },
  ],
});

// Vuex instance
const store = createStore({
  state() {
    return {
      dialogTrigger: false,
      dialogTitle: "",
      dialogContent: "",
      noteTitle: "",
    };
  },
  getters: {
    getDialogTrigger(state) {
      return state.dialogTrigger;
    },
    getDialogTitle(state) {
      return state.dialogTitle;
    },
    getDialogContent(state) {
      return state.dialogContent;
    },
    getNoteTitle(state) {
      return state.noteTitle;
    },
  },
  mutations: {
    setDialogTrigger(state, payload) {
      state.dialogTrigger = payload;
    },
    setDialogTitle(state, payload) {
      state.dialogTitle = payload;
    },
    setDialogContent(state, payload) {
      state.dialogContent = payload;
    },
    setNoteTitle(state, payload) {
      state.noteTitle = payload;
    },
  },
});

app.use(router).use(store).mount("#app");
