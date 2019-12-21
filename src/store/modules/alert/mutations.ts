import { MutationTree } from 'vuex'
import { AlertState, Alert } from './types'
import { ADD_ALERT, REMOVE_ALERT } from './mutation-types'

const mutations: MutationTree<AlertState> = {
  [ADD_ALERT] (state, alert: Alert) {
    state.alerts.unshift(alert)
  },

  [REMOVE_ALERT] (state, alert: Alert) {
    const alerts = state.alerts
    const toRemoveIndex = alerts.indexOf(alert)
    alerts.splice(toRemoveIndex, 1)
  }
}

export default mutations
