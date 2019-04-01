import Vue from 'vue'
import ActionList from '../../components/ActionList'
// ActionList组件构造器
const ActionListConstructor = Vue.extend(ActionList)
// ActionList插件函数
export default function ({ tipText = '', actionList = [] } = {}) {
  // 返回Promise形式的Handler
  return new Promise((resolve, reject) => {
    // 构造actionList实例
    let instance = new ActionListConstructor({
      el: document.createElement('div'),
      propsData: {
        actionList,
        tipText
      }
    })
    // 传递resolve和reject函数
    instance.funcResolve = resolve
    instance.funcReject = reject
    // 监听关闭事件
    instance.$on('close', () => {
      document.body.removeChild(instance.$el)
    })
    // 挂载到body节点
    document.body.appendChild(instance.$el)
  })
}
