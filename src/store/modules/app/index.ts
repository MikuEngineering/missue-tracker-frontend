import store from '@/store'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { ADD_ALERT, REMOVE_ALERT, SET_IS_PAGE_LOADING, SET_USER } from './mutationTypes'
import User from '@/interfaces/User'
import Alert from '@/interfaces/Alert'
import api from '@/api/api'
import md5 from 'js-md5'
import UserPermission from '@/enums/UserPermission'

@Module({ dynamic: true, store, name: 'app' })
class AppModule extends VuexModule {
  isPageLoading: boolean = false
  alerts: Alert[] = []
  user: User | null = null

  get isLoggedIn () {
    return this.user !== null
  }

  get isAdmin () {
    if (this.user === null) return false
    return this.user.permission === UserPermission.Admin
  }

  get gravatarImgUrl () {
    if (this.user === null) return ''
    const hash = md5(this.user.email)
    return `https://www.gravatar.com/avatar/${hash}`
  }

  @Mutation
  [SET_USER] (user: User) {
    this.user = user
  }

  @Mutation
  [SET_IS_PAGE_LOADING] (isPageLoading: boolean) {
    this.isPageLoading = isPageLoading
  }

  @Mutation
  [ADD_ALERT] (alert: Alert) {
    this.alerts.unshift(alert)
  }

  @Mutation
  [REMOVE_ALERT] (alert: Alert) {
    const toRemoveIndex = this.alerts.indexOf(alert)
    this.alerts.splice(toRemoveIndex, 1)
  }

  @Action
  setIsPageLoading (isPageLoading: boolean) {
    this.context.commit(SET_IS_PAGE_LOADING, isPageLoading)
  }

  @Action
  addAlert (params: { type: string, message: string }) {
    const TIMEOUT = 3000
    const alert: Alert = {
      ...params,
      timeoutId: setTimeout(() => {
        this.context.commit(REMOVE_ALERT, alert)
      }, TIMEOUT)
    }
    this.context.commit(ADD_ALERT, alert)
  }

  @Action
  removeAlert (alert: Alert) {
    clearTimeout(alert.timeoutId)
    this.context.commit(REMOVE_ALERT, alert)
  }

  @Action({ rawError: true })
  async register (params: { username: string, password: string }) {
    await api.register(params)
  }

  @Action({ rawError: true })
  async logout () {
    await api.logout().catch(() => {})
    this.context.commit(SET_USER, null)
    sessionStorage.removeItem('username')
    localStorage.removeItem('username')
  }

  @Action({ rawError: true })
  async validateSession () {
    const isSessionExist = await api.validateSession()
      .then(() => true)
      .catch(async () => {
        await this.logout()
        return false
      })
    if (isSessionExist && this.user === null) {
      const username = sessionStorage.getItem('username') || localStorage.getItem('username')
      if (username) {
        await this.afterLoggedIn(username)
      } else {
        await this.logout()
      }
    }
  }

  @Action({ rawError: true })
  async login (params: { username: string, password: string, isKeepLogin: boolean }) {
    const { username, password, isKeepLogin } = params
    try {
      await api.login({ username, password })
      if (isKeepLogin) {
        localStorage.setItem('username', username)
      } else {
        sessionStorage.setItem('username', username)
      }
    } catch (error) {
      await this.logout()
      throw error
    }
    await this.afterLoggedIn(username)
  }

  @Action({ rawError: true })
  async afterLoggedIn (username: string) {
    try {
      const user = await api.getUserByUsername(username)
      this.context.commit(SET_USER, user)
    } catch (error) {
      await this.logout()
      throw error
    }
  }
}

export default getModule(AppModule)
