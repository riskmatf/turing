import Vue from 'vue'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' },
    },
    mutations: {
        setRequest(state, { request }) {
            state.request = request
        },
    },
    actions: {
        async fetchAllClassrooms({ commit }) {
            try {
                commit('setRequest', { request: { status: 'loading' } })
                let response = await Vue.$http.get('/api/v1/classrooms')
                commit('setRequest', { request: { status: 'success', response: response.data } })
                return response.data
            } catch (e) {
                commit('setRequest', { request: { status: 'error', message: _.get(e, 'response.message', 'Failed') } })
                throw e
            }
        },
        async deleteClassroom(scope, { classroomId }) {
            try {
                await Vue.$http.delete(`/api/v1/admin/classrooms/${classroomId}`)
            } catch (e) {
                throw _.get(e, 'response.data.message', 'Failed')
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