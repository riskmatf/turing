import Vue from 'vue'
import _ from "lodash";

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' },
        lastIdRequested: null,
    },
    getters: {
        report(state) {
            if (state.request.status !== 'success') {
                return null
            }

            return state.request.response
        }
    },
    mutations: {
        setRequest(state, { request }) {
            state.request = request
        },
        setLastIdRequested(state, { lastIdRequested }) {
            state.lastIdRequested = lastIdRequested
        },
    },
    actions: {
        async fetchReport({ commit, state }, { reportId }) {
            commit('setLastIdRequested', { lastIdRequested: reportId })
            commit('setRequest', { request: { status: 'loading' } })
            try {
                const serverResponse = await Vue.$http.get(`/api/v1/admin/reports/${reportId}`)
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
        },
        updateComment(scope, { reportId, comment }) {
            try {
                return Vue.$http.put(`/api/v1/admin/reports/${reportId}/comment`, {
                    comment,
                })
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed')
            }
        },
        solveReport(scope, { reportId }) {
            try {
                return Vue.$http.put(`/api/v1/admin/reports/${reportId}/solve`)
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed')
            }
        },
        deleteReport(scope, { reportId }) {
            try {
                return Vue.$http.delete(`/api/v1/admin/reports/${reportId}`)
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed')
            }
        },
    },
}