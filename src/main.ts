import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './routes'
import { useNotificationStore } from './stores/NotificationStore'
import { useSessionStore } from './stores/SessionStore'


const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

router.beforeEach((to, from, next) => {
  console.log('router beforeEach')
  if (to.meta.requiresAuth) {
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      const notificationStore = useNotificationStore()
      notificationStore.notifyError('Log in first')
      next('/login')
    }
  }
  // console.log(to.name, from.name)
  next()
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
