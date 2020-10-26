import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
import './assets/fonts/iconfont.css'

import 'element-ui/lib/theme-chalk/index.css';
import { Button, Form, FormItem, Input, Message } from 'element-ui';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
