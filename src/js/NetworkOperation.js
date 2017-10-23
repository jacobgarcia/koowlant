import axios from 'axios'

// Authorization header interceptor
axios.interceptors.request.use(config => {
  console.log('TOKEN', localStorage.getItem('token'))
  // Get last url route and check if it's different from authenticate to add header
  if (config.url.split('/').pop() !== 'authenticate') config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}, error => Promise.reject(error))

class NetworkOperation {
  static login(email, password) {
    return axios.post(`${window.baseUrl}/authenticate`, {email, password})
  }

  static signup(token, email, password, fullName) {
    return axios.post(`${window.baseUrl}/signup/` + token, {email, password, fullName})
  }

  static invite(email, company, host) {
    return axios.post(`${window.baseUrl}/users/invite`, { email, company, host })
  }

  static setSite(company, subzone, key, position, sensors, alarms) {
    return axios.post(`${window.baseUrl}/companies/` + company + '/' + subzone + '/sites', { key, position, sensors, alarms })
  }

  static setSubzone(company, zone, name, positions, sites) {
    return axios.post(`${window.baseUrl}/users`)
  }

  static getProfile() {
    return axios.get(`${window.baseUrl}/users/self`)
  }

  static getZones(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/zones')
  }

  static getSubzones(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/subzones')
  }

  static getSites(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/sites')
  }

  static getReports(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/reports')
  }

  static getAll(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/exhaustive')
  }
}

export default NetworkOperation
