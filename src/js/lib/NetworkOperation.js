import axios from 'axios'

import constants from './constants'

const baseUrl = `${constants.hostUrl}/v1`

// Request interceptors
axios.interceptors.request.use(config => {
  // Add token
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  // Do something before request is sent
  return config
}, error => Promise.reject(error))

class NetworkOperation {
  static login({email, password}) {
    return axios.post(`${baseUrl}/authenticate`, { email, password})
  }

  static getSelf() {
    return axios.get(`${baseUrl}/users/self`)
  }

  static getExhaustive() {
    return axios.get(`${baseUrl}/exhaustive`)
  }

  static getReports() {
    return axios.get(`${baseUrl}/reports`)
  }

  static getAvailableStates() {
    return axios.get(`${baseUrl}/polygons/mx`)
  }
}

export default NetworkOperation
