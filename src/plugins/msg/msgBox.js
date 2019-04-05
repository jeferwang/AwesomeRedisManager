import Vue from 'vue'
import MsgBox from '../../components/MsgBox'
const MsgBoxConstructor = Vue.extend(MsgBox)
export default function ({ msg, type, duration } = {}) {
  let instance = new MsgBoxConstructor({
    el: document.createElement('div'),
    propsData: {
      msg,
      type,
      duration
    }
  })
  instance.$on('close', () => {
    document.body.removeChild(instance.$el)
  })
  // 挂载到body节点
  document.body.appendChild(instance.$el)
}
