import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Http } from './plugins/http'
import  ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/global.sass'

Vue.config.productionTip = false

Vue.use(Http, { baseUrl: '' })
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
