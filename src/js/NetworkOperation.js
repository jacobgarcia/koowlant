import axios from 'axios'

class NetworkOperation {
  static login(email, password) {
    console.log(`${window.baseUrl}/authenticate`)
    return axios.post(`${window.baseUrl}/authenticate`, {email, password})
  }

  static saveSite(company, subzone, key, position, sensors, alarms) {
    return axios.post(`${window.baseUrl}/companies/` + company + '/' + subzone + '/sites', { key, position, sensors, alarms })
  }

  static saveSubzone(company, zone, name, positions, sites) {
    return axios.post(`${window.baseUrl}/users`)
  }

}

export default NetworkOperation
