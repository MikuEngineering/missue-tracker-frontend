import { MutationTree } from 'vuex'
import { UserState, Profile } from './types'
import { SET_ID, SET_KEEP_LOGIN, SET_LOGGED_IN, SET_PROFILE } from './mutation-types'

const mutations: MutationTree<UserState> = {
  [SET_LOGGED_IN] (state, value: boolean) {
    state.isLoggedIn = value
  },
  [SET_KEEP_LOGIN] (state, value: boolean) {
    localStorage.setItem('keepLogin', JSON.stringify(value))
    state.keepLogin = value
  },
  [SET_ID] (state, value: number | null) {
    state.id = value
  },
  [SET_PROFILE] (state, value: Profile | null) {
    state.profile = value
  }
}

export default mutations
