import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import 'normalize.css/normalize.css'
import 'font-awesome/css/font-awesome.css'
import './plugins/element.js'
import './plugins/iview.js'
import './style/style.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
