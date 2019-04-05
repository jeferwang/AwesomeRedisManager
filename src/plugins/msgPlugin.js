import msgBox from './msg/msgBox'

const msg = {}
msg.msgBox = msgBox

export default {
  install (Vue) {
    Vue.prototype.$msg = msg
  }
}
