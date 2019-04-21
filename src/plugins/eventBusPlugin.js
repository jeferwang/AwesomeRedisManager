import Vue from 'vue'

let vueInst = new Vue()

export default {
  install (Vue, options) {
    Vue.prototype.$eventBus = vueInst
  }
}
