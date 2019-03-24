import { connectRedis } from '../plugins/redisPlugin'

async function configToTab (config) {
  const connect = await connectRedis(config)
  // connect.disconnect(false)
  return {
    config: config,
    connect: connect,
    active: false
  }
}

const state = {
  tabs: []
}
const getters = {
  allTabs () {
    return state.tabs
  }
}
const mutations = {
  addTab (state, tab) {
    state.tabs.push(tab)
  },
  setAllInactive (state) {
    state.tabs.map(tab => {
      tab.active = false
      return tab
    })
  },
  setActive (state, tabIndex) {
    if (state.tabs.length <= tabIndex) {
      return false
    }
    state.tabs[tabIndex].active = true
  },
  removeTab (state, tabIndex) {
    state.tabs.splice(tabIndex, 1)
  }
}
const actions = {
  async addTabByConfig (context, config) {
    try {
      // 根据connect创建一个tab实例
      const tab = await configToTab(config)
      // 设置当前的为active
      tab.active = true
      // 设置其他的为非active
      context.commit('setAllInactive')
      // 添加到tabs列表
      context.commit('addTab', tab)
      return true
    } catch (e) {
      // 连接失败
      console.log(e)
      return false
    }
  },
  async setTabActive (context, tabIndex) {
    context.commit('setAllInactive')
    context.commit('setActive', tabIndex)
  },
  async closeTab (context, tabIndex) {
    if (context.state.tabs.length <= tabIndex) {
      return false
    }
    let tab = context.state.tabs[tabIndex]
    // 关闭连接
    try {
      tab.connect.disconnect()
    } catch (e) {
      console.log(e)
    }
    context.commit('removeTab', tabIndex)
    if (tab.active && context.state.tabs.length) {
      // 关闭一个active的连接时，把最后一个设置为active
      context.commit('setAllInactive')
      context.commit('setActive', context.state.tabs.length - 1)
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
