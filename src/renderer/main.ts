import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import './style.css'
import MigrationView from './view/MigrationView.vue'
import NotesView from './view/NotesView.vue'
import TodosView from './view/TodosView.vue'

// Vuejs instance
const app = createApp(App)

// Vue-router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Migration', component: MigrationView },
    { path: '/todos', name: 'Todos', component: TodosView },
    { path: '/notes', name: 'Notes', component: NotesView },
  ],
})

// Pinia instance
const pinia = createPinia()

app.use(router).use(pinia).mount('#app')
