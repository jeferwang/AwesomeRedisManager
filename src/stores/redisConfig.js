import { readRedisConfig, writeRedisConfig } from '../plugins/redisPlugin'

function sortConfigs (a, b) {
  return a.createdAt - b.createdAt
}

function getConfigIdxById (id) {
  for (let i = 0; i < state.configs.length; i++) {
    if (state.configs[i].id === id) {
      return i
    }
  }
  return -1
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
    let configs = state.configs
    const configIdx = getConfigIdxById(config.id)
    if (configIdx !== -1) {
      configs[configIdx] = config
    } else {
      configs.push(config)
    }
    state.configs = configs.sort(sortConfigs)
  },
  delConfig (state, id) {
    const configIdx = getConfigIdxById(id)
    if (configIdx !== -1) {
      state.configs.splice(configIdx, 1)
      return true
    }
    return false
  },
  toggleFavConfig (state, id) {
    const configIdx = getConfigIdxById(id)
    if (configIdx !== -1) {
      state.configs[configIdx].isFavorite = !state.configs[configIdx].isFavorite
      return true
    }
    return false
  }
}
const actions = {
  // 读取配置文件中的Redis连接配置
  async readConfigs (context) {
    context.commit('setConfigs', await readRedisConfig())
  },
  // 保存一个Redis连接配置
  async saveConfig (context, config) {
    context.commit('addConfig', config)
    return writeRedisConfig(context.state.configs)
  },
  async toggleFavConfig (context, id) {
    context.commit('toggleFavConfig', id)
    return writeRedisConfig(context.state.configs)
  },
  async delConfig (context, id) {
    context.commit('delConfig', id)
    return writeRedisConfig(context.state.configs)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
