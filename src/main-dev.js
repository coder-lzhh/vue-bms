import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
import './assets/fonts/iconfont.css'

import './elementUI.js'


import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)




import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});
axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
});


Vue.prototype.$http = axios


Vue.filter('dateFormat', function (time) {
  const dt = new Date(time)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
