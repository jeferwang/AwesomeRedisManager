import actionList from './popups/actionList'

const popup = {}
popup.actionList = actionList

export default {
  install (Vue) {
    Vue.prototype.$popup = popup
  }
}
