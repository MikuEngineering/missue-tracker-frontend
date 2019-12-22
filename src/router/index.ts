import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import * as views from '@/views'
import * as gaurds from '@/utils/globalNavigationGaurd'
import AppModule from '@/store/modules/app'
import { delay } from '@/utils/util'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    name: 'auth',
    path: '/auth',
    meta: {
      unauthorizedRequired: true
    },
    component: views.AuthView
  },
  {
    name: 'home',
    path: '/',
    component: views.HomeView
  },
  {
    name: 'home',
    path: '/:username',
    component: views.ProfileView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  AppModule.setIsPageLoading(true)
  next()
  await delay(1000)
  AppModule.setIsPageLoading(false)
})
router.beforeEach(gaurds.sessionValidation)
router.beforeEach(gaurds.unauthorizedRequired)
router.beforeEach(gaurds.authorizedRequired)

export default router
