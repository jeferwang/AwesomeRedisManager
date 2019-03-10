import Vue from 'vue'
import {
  Button,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  InputNumber,
  Card,
  Poptip,
  Modal,
  Message
} from 'iview'

import 'iview/dist/styles/iview.css'

Vue.prototype.$Modal = Modal
Vue.prototype.$Message = Message
Vue.component('Button', Button)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('Input', Input)
Vue.component('InputNumber', InputNumber)
Vue.component('Card', Card)
Vue.component('Poptip', Poptip)
Vue.component('Modal', Modal)
