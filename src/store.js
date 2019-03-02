import Vue from 'vue'
import Vuex from 'vuex'
import redisConfig from './stores/redisConfig'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    redisConfig
  }
})
