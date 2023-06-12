import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";
import "./style.css";
import App from "./App.vue";
import Todos from "./view/Todos.vue";
import Notes from "./view/Notes.vue";

// Vuejs instance
const app = createApp(App);

// Vue-router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Todos", component: Todos },
    { path: "/notes", name: "Notes", component: Notes },
  ],
});

// Vuex instance
const store = createStore({
  state() {
    return {
      dialogConfirmTrigger: false,
      dialogConfirmTitle: "",
      dialogConfirmContent: "",
      dialogConfirmReturn: "",
      dialogColorTrigger: false,
      dialogColorReturn: "",
    };
  },
  getters: {
    getDialogConfirmTrigger(state) {
      return state.dialogConfirmTrigger;
    },
    getDialogConfirmTitle(state) {
      return state.dialogConfirmTitle;
    },
    getDialogConfirmContent(state) {
      return state.dialogConfirmContent;
    },
    getDialogConfirmReturn(state) {
      return state.dialogConfirmReturn;
    },
    getDialogColorTrigger(state) {
      return state.dialogColorTrigger;
    },
    getDialogColorReturn(state) {
      return state.dialogColorReturn;
    },
  },
  mutations: {
    setDialogConfirmTrigger(state, payload) {
      state.dialogConfirmTrigger = payload;
    },
    setDialogConfirmTitle(state, payload) {
      state.dialogConfirmTitle = payload;
    },
    setDialogConfirmContent(state, payload) {
      state.dialogConfirmContent = payload;
    },
    setDialogConfirmReturn(state, payload) {
      state.dialogConfirmReturn = payload;
    },
    setDialogColorTrigger(state, payload) {
      state.dialogColorTrigger = payload;
    },
    setDialogColorReturn(state, payload) {
      state.dialogColorReturn = payload;
    },
  },
});

app.use(router).use(store).mount("#app");
