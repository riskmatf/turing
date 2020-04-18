import Vue from 'vue'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' },
    },
    mutations: {
        setResponse(state, { request }) {
            state.request = request
        },
    },
    actions: {
        async fetchAllClassrooms({ commit }) {
            try {
                commit('setResponse', { request: { status: 'loading' } })
                let response = await Vue.$http.get('/api/v1/classrooms')
                commit('setResponse', { request: { status: 'success', response: response.data } })
                return response.data
            } catch (e) {
                commit('setResponse', { request: { status: 'error', message: _.get(e, 'message', 'Failed') } })
                throw e
            }
        }
    },
    getters: {
        classroomsGroupedByLocation(state) {
            if (state.request.status === 'success') {
                return _.groupBy(state.request.response, (classroom) => classroom.location)
            }
            return null
        },
        allClassrooms(state) {
            return _.get(state.request, 'response', null)
        }
    },
}