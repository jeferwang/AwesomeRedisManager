import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import 'normalize.css/normalize.css'
import 'font-awesome/css/font-awesome.css'
// 自定义插件
import electronPlugin from './plugins/electronPlugin'
import redisPlugin from './plugins/redisPlugin'
import storagePlugin from './plugins/storagePlugin'
import windowsPlugin from './plugins/windowsPlugin'
import formatterPlugin from './plugins/formatterPlugin'
import popupPlugin from './plugins/popupPlugin'
import msgPlugin from './plugins/msgPlugin'
import eventBusPlugin from './plugins/eventBusPlugin'
import services from './services'
import './plugins/keyCodePlugin.js'
import './plugins/iviewPlugin.js'
import './style/style.scss'
import animate from 'animate.css'

Vue.config.productionTip = false

Vue.use(electronPlugin)
Vue.use(redisPlugin)
Vue.use(storagePlugin)
Vue.use(windowsPlugin)
Vue.use(popupPlugin)
Vue.use(msgPlugin)
Vue.use(eventBusPlugin)
Vue.use(services)
Vue.use(formatterPlugin)
Vue.use(animate)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
