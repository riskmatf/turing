import _ from 'lodash'
import Vue from 'vue'

function encodeUrlParams(reportFilters) {
    const result = {
        classrooms: undefined,
        locations: undefined,
        comments: undefined,
        fixed: undefined,
        urgent: undefined,
    }

    if (reportFilters.classrooms) {
        result.classrooms = reportFilters.classrooms
    }
    if (reportFilters.locations) {
        result.locations = reportFilters.locations
    }
    if (!_.isNil(reportFilters.comments)) {
        result.comments = reportFilters.comments ? 'true' : 'false'
    }
    if (!_.isNil(reportFilters.fixed)) {
        result.fixed = reportFilters.fixed ? 'true' : 'false'
    }
    if (!_.isNil(reportFilters.urgent)) {
        result.urgent = reportFilters.urgent ? 'true' : 'false'
    }

    return result
}

function decodeUrlParams(queryParams) {
    const result = {}

    if (queryParams.classrooms) {
        result.classrooms = queryParams.classrooms
        if (!(result.classrooms instanceof  Array)) {
            result.classrooms = [result.classrooms]
        }
    }
    if (queryParams.locations) {
        result.locations = queryParams.locations
        if (!(result.locations instanceof  Array)) {
            result.locations = [result.locations]
        }
    }
    if (!_.isNil(queryParams.comments)) {
        result.comments = queryParams.comments === 'true'
    }
    if (!_.isNil(queryParams.fixed)) {
        result.fixed = queryParams.fixed === 'true'
    }
    if (!_.isNil(queryParams.urgent)) {
        result.urgent = queryParams.urgent === 'true'
    }

    return result
}

export default {
    namespaced: true,
    state: {
        request: { status: 'notInitialized' }
    },
    getters: {
        reports(state) {
            if (state.request.status === 'success') {
                return state.request.response.reports
            }
            return null
        },
        maxPage(state) {
            if (state.request.status === 'success') {
                const maxNumOfPages = state.request.response.paging.maxNumOfPages
                return _.isNil(maxNumOfPages) ? 1 : maxNumOfPages + 1
            }
            return null
        },
    },
    mutations: {
        setRequest(state, { request }) {
            state.request = request
        }
    },
    actions: {
        async fetchReports({ commit }, { filters, page }) {
            const query = encodeUrlParams(filters)
            query.page = page - 1

            commit('setRequest', { request: { status: 'loading' } })
            try {
                const serverResponse = await Vue.$http.get('/api/v1/admin/reports', { params: query })
                commit('setRequest', { request: { status: 'success', response: serverResponse.data } })
                return serverResponse.data
            } catch (e) {
                commit('setRequest', { request: { status: 'error', message: _.get(e, 'response.data.message', 'Failed') } })
                throw e
            }
        },
    }
}

export {
    encodeUrlParams,
    decodeUrlParams,
}