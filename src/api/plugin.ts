import Vue, { PluginFunction } from 'vue'
import Api from './Api'

const api = new Api()

const install: PluginFunction<any> = (Vue) => {
  Vue.prototype.$api = api
}

Vue.use(install)

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api;
  }
}
