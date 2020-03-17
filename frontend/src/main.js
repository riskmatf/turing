import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Http } from './plugins/http'
import  ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(Http, { baseUrl: 'http://turing.dev.matf.bg.ac.rs:3000/api/v1' })
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
