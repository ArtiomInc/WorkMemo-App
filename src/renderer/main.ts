import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'

import App from './App.vue'
import './style.css'
import NotesView from './view/NotesView.vue'
import TodosView from './view/TodosView.vue'

// Vuejs instance
const app = createApp(App)

// Vue-router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Todos', component: TodosView },
    { path: '/notes', name: 'Notes', component: NotesView },
  ],
})

// Vuex instance
const store = createStore({
  state() {
    return {}
  },
})

app.use(router).use(store).mount('#app')
