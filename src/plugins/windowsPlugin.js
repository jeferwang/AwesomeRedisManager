import electronPlugin from './electronPlugin'

const windowManager = {
  openCreateConfig ({ title = '新建连接' } = {}) {
    electronPlugin.getApp().emit('createWindow', {
      initPath: 'Create/CreateConfig',
      width: 600,
      height: 400,
      resizable: false,
      title: title,
      closedEvents: { 'refreshConfigData': null }
    })
  }
}

export default {
  windowManager,
  install (Vue, options) {
    Vue.prototype.$windowsManager = windowManager
  }
}
