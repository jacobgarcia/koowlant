import axios from 'axios'

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

  static getZones(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/zones')
  }

  static getSubzones(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/subzones')
  }

  static getSites(company) {
    return axios.get(`${window.baseUrl}/companies/` + company + '/sites')
  }
}

export default NetworkOperation
