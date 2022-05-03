import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import CollectiveList from './components/CollectiveList.vue'
import HelloWorld from './components/HelloWorld.vue'
import CollectiveView from './views/CollectiveView.vue'

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: [
        { path: '/', name: 'home', component: CollectiveList },
        { path: '/login', name: 'login', component: HelloWorld },
        { path: '/c/:collectiveName', name: 'collective', component: CollectiveView }
    ]
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
