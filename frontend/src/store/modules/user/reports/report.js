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
        },
        clearReportData(state) {
            state.request = { status: 'notInitialized',  }
            state.setLastIdRequested = null
        },
    },
    actions: {
        async fetchReport({ commit, state }, { reportId }) {
            commit('setLastIdRequested', { lastIdRequested: reportId })
            commit('setRequest', { request: { status: 'loading' } })
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
        },
        async addReport(scope, report) {
            try {
                const response = await Vue.$http.post('/api/v1/reports', {
                    computerId: report.computerId,
                    classroomName: report.classroomId,
                    urgent: report.isUrgent,
                    isGeneral: report.isGeneral,
                    description: report.description,
                })
                console.log(response.data)
                return response.data
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed')
            }

        }
    },
}
