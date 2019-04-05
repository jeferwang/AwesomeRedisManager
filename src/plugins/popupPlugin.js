import actionList from './popup/actionList'

const popup = {}
popup.actionList = actionList

export default {
  install (Vue) {
    Vue.prototype.$popup = popup
  }
}
