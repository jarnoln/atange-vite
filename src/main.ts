import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { routes } from './routes'
import { useNotificationStore } from './stores/NotificationStore'
import { useSessionStore } from './stores/SessionStore'


const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

router.beforeEach((to, from, next) => {
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


const messages = {
  'en': {
    about: 'About',
    candidates: 'Candidates',
    district: 'District',
    home: 'Home',
    login: 'Login',
    name: 'Name',
    party: 'Party',
    password: 'Password',
    questions: 'Questions',
    register: 'Register'
  },
  'fi': {
    about: 'Tiedot',
    candidates: 'Ehdokkaat',
    district: 'Vaalipiiri',
    home: 'Etusivu',
    login: 'Kirjaudu',
    name: 'Nimi',
    party: 'Puolue',
    password: 'Salasana',
    questions: 'Kysymykset',
    register: 'Rekisteröidy'
  }
}

const i18n = createI18n({
  locale: 'fi',
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
