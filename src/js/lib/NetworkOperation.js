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

  static getUsers() {
    return axios.get(`${baseUrl}/users`)
  }

  static setZone(name, positions) {
    return axios.post(`${baseUrl}/zones`, {name, positions})
  }

  static setSubzone(zone, name, positions) {
    return axios.post(`${baseUrl}/${zone}/subzones`, { positions, name })
  }

  static setSite(zone, subzone, name, key, position) {
    return axios.post(`${baseUrl}/zones/${zone}/subzones/${subzone}/sites`, { key, position, name })
  }

  static getGeneralStats(from, to) {
    return axios.get(`${baseUrl}/stats?from=${from}&to=${to}`)
  }

  static getGeneralAlarms(from, to) {
    return axios.get(`${baseUrl}/alarms?from=${from}&to=${to}`)
  }
}

export default NetworkOperation
