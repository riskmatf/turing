import Vue from 'vue'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' },
        lastIdRequested: null
    },
    getters: {
        report(state) {
            return _.get(state.request, 'response', null)
        }
    },
    mutations: {
        setRequest(state, { request }) {
            state.request = request
        },
        setLastIdRequested(state, { lastIdRequested }) {
            state.lastIdRequested = lastIdRequested
        }
    },
    actions: {
        async fetchReport({ commit, state }, { reportId }) {
            commit('setRequest', { request: { status: 'loading' } })
            if (state.lastIdRequested === reportId) {
                try {
                    const serverResponse = await Vue.$http.get(`/api/v1/reports/${reportId}`)
                    if (state.lastIdRequested === reportId) {
                        commit('setRequest', { request: { status: 'success', response: serverResponse.data } })
                    }
                    return serverResponse.data
                } catch (e) {
                    commit('setRequest', {
                        request: { status: 'error', message: _.get(e, 'response.data.message', 'Failed') }
                    })
                    throw e
                }
            }

            commit('setLastIdRequested', { lastIdRequested: reportId })
            try {
                const serverResponse = await Vue.$http.get(`/api/v1/reports/${reportId}`)
                if (state.lastIdRequested === reportId) {
                    commit('setRequest', { request: { status: 'success', response: serverResponse.data } })
                }
                return serverResponse.data
            } catch (e) {
                commit('setRequest', {
                    request: { status: 'error', message: _.get(e, 'response.data.message', 'Failed') }
                })
                throw e
            }
        }
    },
}
