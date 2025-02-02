import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScratchView from '../views/ScratchView.vue'
import ScratchView2 from '../views/ScratchView2.vue'
import ScratchViewNew from '../views/ScratchViewNew.vue'
import ScratchViewNew2 from '../views/ScratchViewNew2.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'scratchView',
    component: ScratchView
  },
  {
    path: '/letizia',
    name: 'letizia',
    component: ScratchView
  },
  {
    path: '/letizia_new',
    name: 'letizia_new',
    component: ScratchViewNew
  },
  {
    path: '/rekarita',
    name: 'rekarita',
    component: ScratchView2
  },
  {
    path: '/rekarita_new',
    name: 'rekarita_new',
    component: ScratchViewNew2
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
