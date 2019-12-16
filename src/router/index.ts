import Vue from 'vue'
import VueRouter from 'vue-router'
import * as views from '@/views'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: views.HomeView
  },
  {
    name: 'auth',
    path: '/auth',
    component: views.AuthView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
