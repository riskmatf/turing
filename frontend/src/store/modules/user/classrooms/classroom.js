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
        async fetchClassroom({ rootState, commit, dispatch }, { classroomId }) {
            let classroomListData = null

            commit('setRequest', { request: { status: 'loading' } })
            try {
                if (rootState.Classroom.AllClassrooms.request.status !== 'success') {
                    classroomListData = await dispatch('Classroom/AllClassrooms/fetchAllClassrooms', null, { root: true })
                } else {
                    classroomListData = rootState.Classroom.AllClassrooms.request.response
                }
            } catch (e) {
                commit('setRequest', { request : { status: 'error', message: _.get(e, 'message', 'Failed') } })
                throw e
            }

            let targetClassroom = classroomListData.find((classroom) => classroom.name === classroomId)

            if (targetClassroom === undefined) {
                commit('setRequest', { request: { status: 'error', message: 'No classroom found' } })
                throw new Error('No classroom found')
            }

            try {
                const response = await Vue.$http.get(`/api/v1/classrooms/${classroomId}/computers`)
                commit('setRequest', {
                    request:
                        {
                            status: 'success',
                            response: {
                                ...targetClassroom,
                                computers: response.data
                            }
                        }
                })
            } catch (e) {
                commit('setRequest', { request: { status: 'error', message: _.get(e, 'message', 'Filed') } })
                throw e
            }
        }
    },
    getters: {
        classroom(state) {
            return _.get(state.request, 'response', null)
        }
    },
}