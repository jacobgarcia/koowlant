import axios from 'axios'

// Authorization header interceptor
axios.interceptors.request.use(config => {
  // Get last url route and check if it's different from authenticate to add header
  if (config.url.split('/').pop() !== 'authenticate') config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

class NetworkOperation {
  static login(email, password) {
    return axios.post(`${window.baseUrl}/authenticate`, {email, password})
  }

  static signup(token, email, password, fullName) {
    return axios.post(`${window.baseUrl}/signup/` + token, {email, password, fullName})
  }

  static invite(email, host) {
    return axios.post(`${window.baseUrl}/users/invite`, { email, host })
  }

  static setZone(name, positions) {
    return axios.post(`${window.baseUrl}/zones`, {name, positions})
  }

  static setSubzone(zone, name, positions) {
    return axios.post(`${window.baseUrl}/${zone}/subzones`, { positions, name })
  }

  static setSite(zone, subzone, name, key, position) {
    return axios.post(`${window.baseUrl}/zones/${zone}/subzones/${subzone}/sites`, { key, position, name })
  }

  static getProfile() {
    return axios.get(`${window.baseUrl}/users/self`)
  }

  static getZones() {
    return axios.get(`${window.baseUrl}/zones`)
  }

  static getSubzones() {
    return axios.get(`${window.baseUrl}/subzones`)
  }

  static getSites() {
    return axios.get(`${window.baseUrl}/sites`)
  }

  static getReports() {
    return axios.get(`${window.baseUrl}/reports`)
  }

  static getAll() {
    console.log(`${window.baseUrl}/exhaustive`)
    return axios.get(`${window.baseUrl}/exhaustive`)
  }

  static getAvailableStates() {
    return axios.get(`${window.baseUrl}/polygons/mx`)
  }

  static getStatePolygon(stateId) {
    return axios.get(`${window.baseUrl}/polygons/mx/${stateId}`)
  }
}

export default NetworkOperation
