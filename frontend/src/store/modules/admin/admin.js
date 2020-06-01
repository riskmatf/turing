import Vue from 'vue'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        adminData: null,
        isAdminLoggedIn: false,
    },
    getters: {
        adminDisplayName(state) {
            if (state.isAdminLoggedIn) {
                return state.adminData.displayName
            }
            return null
        },
    },
    mutations: {
        setAdminLoggedInState(state, { adminData, isAdminLoggedIn }) {
          state.adminData = adminData
          state.isAdminLoggedIn = isAdminLoggedIn
        },
        clearLoginState(state) {
            state.adminData = null
            state.isAdminLoggedIn = false
        },
        newDisplayName(state, { displayName }) {
            state.adminData.displayName = displayName
            console.log(displayName)
        },
        newPassword(state, { password }) {
            state.adminData.password = password
        },
    },
    actions: {
        async whoami({ commit }) {
            try {
                let serverResponse = await Vue.$http.get('/api/v1/admin/whoami')
                commit('setAdminLoggedInState', { adminData: serverResponse.data, isAdminLoggedIn: true })
                Vue.cookie.set('loggedInUsername', serverResponse.data.username)
                return serverResponse.data
            } catch (e) {
                commit('clearLoginState')
                throw _.get(e, 'response.data.message', 'Failed whoami')
            }
        },
        async login({ dispatch }, { username, password }) {
            try {
                await Vue.$http.post('/api/v1/admin/login', { username, password })
                await dispatch('whoami')
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed login')
            }
        },
        async logout({ commit }) {
            try {
                await Vue.$http.post('/api/v1/admin/logout')
                commit('clearLoginState')
                Vue.cookie.delete('loggedInUsername')
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed logout')
            }
        },
        async changeName({ commit, state }, { displayName }) {
            try {
                let username = state.adminData.username
                await Vue.$http.put(`/api/v1/admin/${username}/displayName`, { displayName })
                commit('newDisplayName', { displayName })
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed changing name')
            }
        },
        async changePassword({ commit, state }, {password}) {
            try {
                let username = state.adminData.username
                await Vue.$http.put(`/api/v1/admin/${username}/password`, {password})
                commit('newPassword', { password })
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed changing password')
            }
        },
    },
}