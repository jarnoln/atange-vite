import { RouteRecordRaw } from 'vue-router'
import AboutView from './views/AboutView.vue'
import CollectiveView from './views/CollectiveView.vue'
import CollectiveBaseView from './views/CollectiveBaseView.vue'
import EditCollective from './components/EditCollective.vue'
import EditQuestion from './components/EditQuestion.vue'
import HomeView from './views/HomeView.vue'
import PageNotFoundView from './views/PageNotFoundView.vue'
import QuestionView from './views/QuestionView.vue'
import UserLogin from './components/UserLogin.vue'
import UserView from './views/UserView.vue'


export const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/login', name: 'login', component: UserLogin },
  { path: '/register', name: 'register', component: UserLogin },
  { path: '/user', name: 'user-view', component: UserView, meta: { requiresAuth: true } },
  { path: '/new', name: 'create-collective', component: EditCollective, meta: { requiresAuth: true } },
  {
    name: 'collective',
    path: '/c/:collectiveName',
    component: CollectiveBaseView,
    props: true,
    children: [
      { path: '', name: 'collective-view', component: CollectiveView },
      { path: 'edit', name: 'collective-edit', component: EditCollective, meta: { requiresAuth: true } },
      { path: 'add_question', name: 'create-question', component: EditQuestion, props: true, meta: { requiresAuth: true } },
      { path: 'q/:questionName', name: 'question', component: QuestionView, props: true },
      { path: 'q/:questionName/edit', name: 'question-edit', component: EditQuestion, props: true, meta: { requiresAuth: true } },
    ]
  },
  { path: '/:notFound(.*)', name: 'not-found', component: PageNotFoundView }
]
