import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Http } from './plugins/http'
Vue.config.productionTip = false

Vue.use(Http, { baseUrl: 'http://turing.dev.matf.bg.ac.rs:3000/api/v1' })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
