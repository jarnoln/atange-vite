import { RouteRecordRaw } from 'vue-router'
import CollectiveView from './views/CollectiveView.vue'
import EditCollective from './components/EditCollective.vue'
import HomeView from './views/HomeView.vue'
import PageNotFoundView from './views/PageNotFoundView.vue'
import UserLogin from './components/UserLogin.vue'

export const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: UserLogin },
  { path: '/register', name: 'register', component: UserLogin },
  { path: '/new', name: 'create-collective', component: EditCollective, props: { collectiveName: ''}, meta: { requiresAuth: true } },
  { path: '/c/:collectiveName', name: 'collective', component: CollectiveView, props: true },
  { path: '/c/:collectiveName/edit', name: 'collective-edit', component: EditCollective, props: true, meta: { requiresAuth: true } },
  { path: '/:notFound(.*)', name: 'not-found', component: PageNotFoundView }
]
