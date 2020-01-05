import AppModule from '@/store/modules/app'
import { NavigationGuard } from 'vue-router'

export const sessionValidation: NavigationGuard = async (to, from, next) => {
  await AppModule.validateSession()
  next()
}

export const unauthorizedRequired: NavigationGuard = async (to, from, next) => {
  if (to.matched.some(record => !record.meta.unauthorizedRequired)) {
    next()
    return
  }

  if (AppModule.isLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
}

export const authorizedRequired: NavigationGuard = async (to, from, next) => {
  if (to.matched.some(record => !record.meta.authorizedRequired)) {
    next()
    return
  }

  if (AppModule.isLoggedIn) {
    next()
  } else {
    next({ name: 'auth' })
  }
}
