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
				if (rootState.User.Classroom.AllClassrooms.request.status !== 'success') {
					classroomListData = await dispatch('User/Classroom/AllClassrooms/fetchAllClassrooms', null, { root: true })
				} else {
					classroomListData = rootState.User.Classroom.AllClassrooms.request.response
				}
			} catch (e) {
				commit('setRequest', { request : { status: 'error', message: _.get(e, 'message', 'Failed') } })
				throw e
			}

			let targetClassroom = classroomListData.find((classroom) => classroom.name === classroomId)

			if (targetClassroom === undefined) {
				commit('setRequest', { request: { status: 'error', message: 'Nije pronađena učionica!'} })
				throw new Error('Nije pronađena učionica!');
			}

			try {
				const response = await Vue.$http.get(`/api/v1/classrooms/${classroomId}`)
				commit('setRequest', {
					request:
						{
							status: 'success',
							response: {
								...targetClassroom,
								computers: response.data.computers,
								hasGeneralReports: response.data.hasGeneralReports,
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
