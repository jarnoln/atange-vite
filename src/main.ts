import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import CollectiveView from './views/CollectiveView.vue'
import EditCollective from './components/EditCollective.vue'
import HomeView from './views/HomeView.vue'
import UserLogin from './components/UserLogin.vue'

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/login', name: 'login', component: UserLogin },
        { path: '/register', name: 'register', component: UserLogin },
        { path: '/new', name: 'create-collective', component: EditCollective },
        { path: '/c/:collectiveName', name: 'collective', component: CollectiveView }
    ]
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
