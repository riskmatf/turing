import Vue from 'vue'
import Vuex from 'vuex'

import Classroom from './modules/user/classrooms'
import Report from  './modules/user/reports'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        Classroom,
        Report,
    }
})