import store from '@/store'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { ADD_ALERT, REMOVE_ALERT } from './mutationTypes'

export interface Alert {
  type: string,
  message: string,
  timeoutId: number
}

@Module({ dynamic: true, store, name: 'app' })
class AppModule extends VuexModule {
  alerts: Alert[] = []

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
}

export default getModule(AppModule)
