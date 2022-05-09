import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: routes
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
