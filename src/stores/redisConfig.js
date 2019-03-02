import fs from 'fs'
import electronPlugin from '../plugins/electron'

function sortConfigs (a, b) {
  return a.createdAt - b.createdAt
}

const state = {
  configs: []
}
const getters = {
  getConfigs (state) {
    return state.configs
  },
  getFavoriteConfigs (state) {
    return state.configs.filter(c => c.isFavorite)
  }
}
const mutations = {
  // 直接设置整个configs数组
  setConfigs (state, configs) {
    state.configs = configs.sort(sortConfigs)
  },
  // configs数组添加一项
  addConfig (state, config) {
    state.configs = [...state.configs, config].sort(sortConfigs)
  }
}
const actions = {
  // 读取配置文件中的Redis连接配置
  readConfigs (context) {
    const redisConfigPath = `${electronPlugin.getConfigPath()}/redisConfig.json`
    fs.access(redisConfigPath, function (err) {
      if (err) {
        console.warn(err)
        return false
      }
      fs.readFile(redisConfigPath, (err, data) => {
        if (err) {
          console.log(err)
          return false
        }
        data = JSON.parse(data)
        context.commit('setConfigs', data)
      })
    })
  },
  // 保存一个Redis连接配置
  saveConfig (context, config) {
    return new Promise((resolve, reject) => {
      // 放入state
      context.commit('addConfig', config)
      // 写入文件
      const redisConfigPath = `${electronPlugin.getConfigPath()}/redisConfig.json`
      fs.writeFile(redisConfigPath, JSON.stringify(context.state.configs, null, '  '), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve('OK')
        }
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
