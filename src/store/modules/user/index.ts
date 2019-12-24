import store from '@/store'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { SET_ID, SET_KEEP_LOGIN, SET_LOGGED_IN, SET_PROFILE } from './mutationTypes'
import { GetUser } from '@/api/dto'
import Api from '@/api/Api'
import md5 from 'js-md5'
import UserPermission from '@/enums/UserPermission'

const api = Api.getInstance()

export interface Profile extends GetUser {}

@Module({ dynamic: true, store, name: 'user' })
class UserModule extends VuexModule {
  keepLogin: boolean = JSON.parse(localStorage.getItem('keepLogin') || 'false')
  id: number | null = null
  isLoggedIn: boolean = false
  profile: Profile | null = null

  get gravatarImgUrl () {
    if (this.profile === null) return ''
    const hash = md5(this.profile.email)
    return `https://www.gravatar.com/avatar/${hash}`
  }

  get isAdmin () {
    if (this.profile === null) return false
    return this.profile.permission === UserPermission.Admin
  }

  @Mutation
  [SET_LOGGED_IN] (value: boolean) {
    this.isLoggedIn = value
  }

  @Mutation
  [SET_KEEP_LOGIN] (value: boolean) {
    localStorage.setItem('keepLogin', JSON.stringify(value))
    this.keepLogin = value
  }

  @Mutation
  [SET_ID] (value: number | null) {
    this.id = value
  }

  @Mutation
  [SET_PROFILE] (value: Profile | null) {
    this.profile = value
  }

  @Action({ rawError: true })
  async validateSession () {
    try {
      await api.validateSession()
      this.context.commit(SET_LOGGED_IN, true)
    } catch (error) {
      this.context.commit(SET_LOGGED_IN, false)
    }
  }

  @Action({ rawError: true })
  async register (params: { username: string, password: string }) {
    await api.register(params)
  }

  @Action({ rawError: true })
  async login (params: { username: string, password: string, isKeepLogin: boolean }) {
    const { username, password, isKeepLogin } = params
    try {
      await api.login({ username, password })
      this.context.commit(SET_KEEP_LOGIN, isKeepLogin)
      localStorage.setItem('username', username)
    } catch (error) {
      await this.context.dispatch('logout')
      throw error
    }
    await this.context.dispatch('afterLoggedIn', username)
  }

  @Action({ rawError: true })
  async afterLoggedIn (username: string) {
    try {
      const id = await api.getUserIdByUsername(username)
      const profile = await api.getUser(id)
      this.context.commit(SET_LOGGED_IN, true)
      this.context.commit(SET_ID, id)
      this.context.commit(SET_PROFILE, profile)
    } catch (error) {
      await this.context.dispatch('logout')
      throw error
    }
  }

  @Action({ rawError: true })
  async logout () {
    try { await api.logout } catch {}
    localStorage.removeItem('username')
    this.context.commit(SET_LOGGED_IN, false)
    this.context.commit(SET_KEEP_LOGIN, false)
    this.context.commit(SET_ID, null)
    this.context.commit(SET_PROFILE, null)
  }
}

export default getModule(UserModule)
