import axios from 'axios'
import _ from 'lodash'


export const Http = {
    install(Vue, options) {
        if (_.isNil(options.baseUrl)) {
            throw new Error('Plugin http needs baseUrl option')
        }

        const httpImpl = new HttpImpl(options.baseUrl)
        Vue.$http = httpImpl
        Vue.prototype.$http =  httpImpl
    }
}


/**
 * change later whit implementation that handles errors
 */
class HttpImpl {

    constructor(basePath) {
        this._mBasePath = basePath

        if (this._mBasePath.endsWith('/')) {
            this._mBasePath = this._mBasePath.slice(0, this._mBasePath.length-1)
        }
    }

    _getFullUrl(url) {
        let fullUrl = this._mBasePath
        if (url.startsWith('/' )) {
            fullUrl += url
        } else {
            fullUrl += '/' + url
        }

        return fullUrl
    }

    async get(url, config) {

        return axios.get(this._getFullUrl(url), config)
    }

    async post(url, data, config) {
        return axios.post(this._getFullUrl(url), data, config)
    }

    async put(url, data, config) {
        return axios.put(this._getFullUrl(url), data, config)
    }

    async delete(url, config) {
        return axios.delete(this._getFullUrl(url), config)
    }

}

