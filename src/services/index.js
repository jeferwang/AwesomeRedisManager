import script from './script'

export default {
  install (Vue, options) {
    Vue.prototype.$services = {
      script
    }
  }
}
