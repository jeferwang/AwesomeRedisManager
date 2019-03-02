import electron from 'electron'
import fs from 'fs'

function getApp () {
  return electron.app || electron.remote.app
}

function getUserDataPath () {
  const app = getApp()
  const userDataPath = app.getPath('userData')
  !fs.existsSync(userDataPath) && fs.mkdirSync(userDataPath)
  return userDataPath
}

function getConfigPath () {
  const userDataPath = getUserDataPath()
  const configPath = `${userDataPath}/configs`
  !fs.existsSync(configPath) && fs.mkdirSync(configPath)
  return configPath
}

function getCurrentWindow () {
  return electron.remote.getCurrentWindow()
}

export default {
  getApp,
  getUserDataPath,
  getConfigPath,
  getCurrentWindow,
  install (Vue, options) {
    Vue.prototype.$getElectronApp = getApp
    Vue.prototype.$getUserDataPath = getUserDataPath
    Vue.prototype.$getConfigPath = getConfigPath
    Vue.prototype.$getCurrentWindow = getCurrentWindow
  }
}
