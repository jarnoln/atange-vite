import { RouteRecordRaw } from 'vue-router'
import AboutView from './views/AboutView.vue'
import CandidateView from './views/CandidateView.vue'
import CandidatesView from './views/CandidatesView.vue'
import CollectiveView from './views/CollectiveView.vue'
import CollectiveBaseView from './views/CollectiveBaseView.vue'
import EditCollective from './components/EditCollective.vue'
import EditQuestion from './components/EditQuestion.vue'
import EditUserView from './views/EditUserView.vue'
import HomeView from './views/HomeView.vue'
import PageNotFoundView from './views/PageNotFoundView.vue'
import ReorderQuestionsView from './views/ReorderQuestionsView.vue'
import QuestionView from './views/QuestionView.vue'
import UserLogin from './components/UserLogin.vue'
import UserView from './views/UserView.vue'


export const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/candidates', name: 'candidates', component: CandidatesView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/login', name: 'login', component: UserLogin },
  { path: '/register', name: 'register', component: UserLogin },
  { path: '/user', name: 'user-view', component: UserView, meta: { requiresAuth: true } },
  { path: '/user/edit', name: 'user-edit', component: EditUserView, meta: { requiresAuth: true } },
  { path: '/new', name: 'create-collective', component: EditCollective, meta: { requiresAuth: true } },
  {
    path: '/c/:collectiveName',
    name: 'collective',
    component: CollectiveBaseView,
    props: true,
    children: [
      { path: '', name: 'collective-view', component: CollectiveView },
      { path: 'edit', name: 'collective-edit', component: EditCollective, meta: { requiresAuth: true } },
      { path: 'add/:itemType/', name: 'create-question', component: EditQuestion, props: true, meta: { requiresAuth: true } },
      { path: 'reorder', name: 'collective-reorder', component: ReorderQuestionsView, props: true, meta: { requiresAuth: true } },
      { path: 'q/:questionName', name: 'question', component: QuestionView, props: true },
      { path: 'q/:questionName/edit', name: 'question-edit', component: EditQuestion, props: true, meta: { requiresAuth: true } },
    ]
  },
  { path: '/candidate/:candidateName', name: 'candidate-view', component: CandidateView, props: true },
  { path: '/:notFound(.*)', name: 'not-found', component: PageNotFoundView }
]
