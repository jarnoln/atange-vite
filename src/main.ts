import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import CollectiveList from './components/CollectiveList.vue'
import HelloWorld from './components/HelloWorld.vue'

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: [
        { path: '/', component: CollectiveList },
        { path: '/hello', component: HelloWorld },
    ]
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
