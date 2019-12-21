import { Module } from 'vuex'
import { UserState } from './types'
import { RootState } from '../../types'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
const namespaced = true
const module: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}

export default module
