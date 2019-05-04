import Vue from 'vue'
import RunLuaScript from './RunLuaScript'
import store from '../../store'

const RunLuaScriptConstructor = Vue.extend(RunLuaScript)

export default {
  runLuaScript () {
    return new Promise((resolve, reject) => {
      let instance = new RunLuaScriptConstructor({
        el: document.createElement('div'),
        propsData: {
          resolve
        },
        store
      })
      instance.$on('close', () => {
        document.body.removeChild(instance.$el)
        // reject(new Error('用户选择了取消'))
      })
      document.body.appendChild(instance.$el)
    })
  }
}
