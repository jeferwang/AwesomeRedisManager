import Vue from 'vue'
import Vuex from 'vuex'
import redisConfig from './stores/redisConfig'
import tabs from './stores/tabs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // 配置管理
    redisConfig,
    // 标签管理
    tabs
  }
})
