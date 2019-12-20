import Vue, { PluginFunction } from 'vue'
import Api from './Api'

const install: PluginFunction<any> = (Vue) => {
  Vue.prototype.$api = Api.getInstance()
}

Vue.use(install)

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api;
  }
}
