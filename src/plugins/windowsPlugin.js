import electronPlugin from './electronPlugin'

const windowManager = {
  openCreateConfig () {
    electronPlugin.getApp().emit('createWindow', {
      initPath: 'Create/CreateConfig',
      width: 600,
      height: 400,
      title: '新建连接',
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
