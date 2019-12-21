import { ActionTree } from 'vuex'
import { AlertState, Alert } from './types'
import { RootState } from '../../types'
import { ADD_ALERT, REMOVE_ALERT } from './mutation-types'

const actions: ActionTree<AlertState, RootState> = {
  addAlert ({ commit }, params: { type: string, message: string }) {
    const TIMEOUT = 3000
    const alert: Alert = {
      ...params,
      timeoutId: setTimeout(() => {
        commit(REMOVE_ALERT, alert)
      }, TIMEOUT)
    }
    commit(ADD_ALERT, alert)
  },

  removeAlert ({ commit }, alert: Alert) {
    clearTimeout(alert.timeoutId)
    commit(REMOVE_ALERT, alert)
  }

  /* (state, params: { type: string, message: string, timeoutCallback: Function }) {
    const TIMEOUT = 3000
    const { timeoutCallback, ...alertParams } = params
    const alert: Alert = {
      ...alertParams,
      timeoutId: setTimeout(() => {
        timeoutCallback()
      }, TIMEOUT)
    }
    state.alerts.unshift(alert)
  }, */
}

export default actions
