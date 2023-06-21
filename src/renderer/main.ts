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
    return {};
  },
});

app.use(router).use(store).mount("#app");
