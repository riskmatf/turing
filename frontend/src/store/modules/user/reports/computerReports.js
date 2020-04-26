import Vue from 'vue'
import _ from "lodash";

const reports = []
const longDescription='asdjaksj\nasjkdakldjsa\najskdjalkjsd\nasdkjlasd\n'
for (let i = 0; i < 100; i++) {
    reports.push({ reportId: i, description: longDescription, hasAdminComment: i % 2 === 0, urgent: i%5 === 1, timestamp: Date.now()/1000 })
}

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' }
    },
    getters: {
        reports(state) {
            return _.get(state.request, 'response', null)
        }
    },
    mutations: {
        setRequest(state, { request }) {
            state.request = request
        }
    },
    actions: {
        async fetchComputerReports({ commit }, { classroomId, computerId }) {
            commit('setRequest', { request: { status: 'loading' } })
            try {
                const serverResponse = await Vue.$http.get(
                    '/api/v1/reports',  { params: { computerId: computerId, classroomName: classroomId }}
                )
                commit('setRequest', { request: { status: 'success', response: serverResponse.data } })
                return serverResponse.data
            } catch (e) {
                commit('setRequest', { request: { status: 'error', message: _.get(e, 'response.data.message', 'Failed') } })
                throw e
            }
        },
        async fetchGeneralReports({ commit }, { classroomId }) {
            commit('setRequest', { request: { status: 'loading' } })
            try {
                const serverResponse = await Vue.$http.get(
                    '/api/v1/reports',  { params: { classroomName: classroomId }}
                )
                commit('setRequest', { request: { status: 'success', response: serverResponse.data } })
                return serverResponse.data
            } catch (e) {
                commit('setRequest', { request: { status: 'error', message: _.get(e, 'response.data.message', 'Failed') } })
                throw e
            }
        }
    },
}