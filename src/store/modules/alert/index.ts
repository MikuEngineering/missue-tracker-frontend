import { Module } from 'vuex'
import { AlertState } from './types'
import { RootState } from '../../types'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
const namespaced = true
const module: Module<AlertState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}

export default module
