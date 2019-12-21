import { ActionTree } from 'vuex'
import { UserState } from './types'
import { RootState } from '../../types'
import { SET_ID, SET_KEEP_LOGIN, SET_LOGGED_IN, SET_PROFILE } from './mutation-types'
import ErrorCode from '@/enums/ErrorCode'
import Api, { ApiError, BadRequestResponse, OtherClientErrorResponse } from '@/api/Api'

const api = Api.getInstance()
const actions: ActionTree<UserState, RootState> = {
  async validateSession ({ commit }) {
    try {
      await api.validateSession()
      commit(SET_LOGGED_IN, true)
    } catch (error) {
      commit(SET_LOGGED_IN, false)
      throw error
    }
  },

  async register (_, params: { username: string, password: string }) {
    await api.register(params)
  },

  async login ({ commit, dispatch }, params: { username: string, password: string, isKeepLogin: boolean }) {
    const { username, password, isKeepLogin } = params
    try {
      await api.login({ username, password })
      const id = await api.getUserIdByUsername(username)
      const profile = await api.getUser(id)

      commit(SET_LOGGED_IN, true)
      commit(SET_KEEP_LOGIN, isKeepLogin)
      commit(SET_ID, id)
      commit(SET_PROFILE, profile)
    } catch (error) {
      await dispatch('logout')
      throw error
    }
  },

  async logout ({ commit }) {
    try { await api.logout } catch {}
    commit(SET_LOGGED_IN, false)
    commit(SET_KEEP_LOGIN, false)
    commit(SET_ID, null)
    commit(SET_PROFILE, null)
  }
}

export default actions
