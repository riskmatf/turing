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
                let response = await Vue.$http.get('/api/v1/classrooms')
                commit('setResponse', { request: { status: 'success', response: response.data } })
                return response.data
            } catch (e) {
                console.log(e)
                commit('setResponse', { request: { status: 'error', message: 'Failed' } })
                throw e
            }

        }
    },
    getters: {
        getClassroomsGroupedByLocation(state) {
            if (state.request.status !== 'success') {
                return null
            }
            return _.groupBy(state.request.status, (classroom) => classroom.location)
        }
    },
}