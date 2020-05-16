import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Http } from './plugins/http'
import  ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/global.sass'
import '@fortawesome/fontawesome-free/css/all.min.css'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false

Vue.use(Http, { baseUrl: '' })
Vue.use(ElementUI)
Vue.use(VueCookie)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
