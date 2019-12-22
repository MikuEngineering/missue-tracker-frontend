import UserModule from '@/store/modules/user'
import { NavigationGuard } from 'vue-router'

export const sessionValidation: NavigationGuard = async (to, from, next) => {
  const username: string | null = localStorage.getItem('username')
  await UserModule.validateSession()
  if (UserModule.isLoggedIn) {
    if (username === null) {
      await UserModule.logout()
      next()
      return
    }
    if (UserModule.id === null) {
      await UserModule.afterLoggedIn(username)
    }
    next()
  } else {
    next()
  }
}

export const unauthorizedRequired: NavigationGuard = async (to, from, next) => {
  if (to.matched.some(record => !record.meta.unauthorizedRequired)) {
    next()
    return
  }

  if (UserModule.isLoggedIn) {
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

  if (UserModule.isLoggedIn) {
    next()
  } else {
    next({ name: 'auth' })
  }
}
