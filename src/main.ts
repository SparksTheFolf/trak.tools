import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

// Import components
import HomePage from './pages/HomePage.vue'
import RoutesPage from './pages/RoutesPage.vue'
import RouteDetailPage from './pages/RouteDetailPage.vue'
import AboutPage from './pages/About.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/routes', component: RoutesPage },
  { path: '/routes/:id', component: RouteDetailPage, props: true },
  { path: '/upload', component: () => import('./pages/PlaceholderPage.vue') },
  { path: '/parse', component: () => import('./pages/PlaceholderPage.vue') },
  { path: '/about', component: AboutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')