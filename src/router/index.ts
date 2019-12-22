import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import * as views from '@/views'
import * as gaurds from '@/utils/globalNavigationGaurd'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: views.HomeView
  },
  {
    name: 'auth',
    path: '/auth',
    meta: {
      unauthorizedRequired: true
    },
    component: views.AuthView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(gaurds.sessionValidation)
router.beforeEach(gaurds.unauthorizedRequired)
router.beforeEach(gaurds.authorizedRequired)

export default router
