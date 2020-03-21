import Vue from 'vue'

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
        async fetchClassroom({ rootState, commit, dispatch }, { classroomId }) {
            let classroomListData = null

            try {
                if (rootState.Classroom.AllClassrooms.request.status !== 'success') {
                    classroomListData = await dispatch('Classroom/AllClassrooms/fetchAllClassrooms', null,{root: true})
                } else {
                    classroomListData = rootState.Classroom.AllClassrooms.request.response
                }
            } catch (e) {
                commit('setResponse', { response: { status: 'error', message: 'Failed' } })
                throw e
            }

            let targetClassroom = classroomListData.find((classroom) => classroom.name === classroomId)

            if (targetClassroom === undefined) {
                commit('setResponse', { response: { status: 'error', message: 'No classroom found' } })
                throw new Error('No classroom found')
            }

            try {
                const response = await Vue.$http.get(`/api/v1/classrooms/${classroomId}/computers`)
                commit('setResponse', {
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
                commit('setResponse', { response: { status: 'error', message: 'Failed' } })
                console.log(e)
                throw e
            }
        }
    },
    getters: {

    },
}