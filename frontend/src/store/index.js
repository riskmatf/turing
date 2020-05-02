import Vuex from 'vuex'
import Vue from 'vue'
import User from './userStore'
import Admin from './adminStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Admin,
        User,
    }
})
