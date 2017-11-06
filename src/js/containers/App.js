import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'query-string'

import { setCredentials, alert, dismissAlert, setReport, setSubzone, setZone, setSite } from '../actions'
import Sites from './Sites'
import NoMatch from './NoMatch'
import MapView from './Map'
import Administrators from './Administrators'
import Settings from './Settings'
import Nav from '../components/Nav'
import io from 'socket.io-client'

import NetworkOperation from '../NetworkOperation'

const socket = io() // window.location

class App extends Component {
  componentWillMount() {
    console.log(this.props.credentials)
    const token = localStorage.getItem('token')

    if (!token) {
      localStorage.removeItem('token')
      this.props.history.replace('/login')
      return
    }

    NetworkOperation.getProfile()
    .then(({data}) => {
      const user = data.user

      localStorage.setItem('credentials', JSON.stringify(user))
      this.props.setCredentials({...user, token})
      return NetworkOperation.getAll()
    })
    .then(({data, status}) => {
      if (status === 200) {
          const { sites, subzones, zones } = data

          // Set elements, not doint one after another may cause a bug
          zones.forEach((zone, index, array) => {
            this.props.setZone(zone._id, zone.name, zone.positions)
            if (index === array.length - 1) {
              subzones.forEach((subzone, index, array) => {
                this.props.setSubzone(subzone.parentZone, subzone._id, subzone.name, subzone.positions)
                if (index === array.length - 1) {
                  sites.forEach(site => {
                    this.props.setSite(site.zone, site.subzone, site._id, site.key, site.name, site.position)
                  })
                }
              })
            }
          })
      }
    })
    .catch(error => {
      // Remove token and replace location to login
      localStorage.removeItem('token')
      this.props.history.replace('/login')
      error.response.status !== 401 && console.log(error)
    })
  }

  componentDidMount() {
    this.initSocket(this.props)
  }

  initSocket(props) {
    socket.connect(() => {
    })

    socket.on('connect', () => {
      socket.emit('join', '0293j4ji')
    })

    socket.on('report', report => {
      props.setReport(report)
    })
  }

  render() {
    const props = this.props
    const token = localStorage.getItem('token')
    const hasToken = token !== null && token !== '' && token !== 'null'

    if (hasToken === false) {
      return (
        <Redirect to="/login" />
      )
    }

    const { isWindow } = qs.parse(props.location.search)

    return (
      <div id="app-content">
        { isWindow ? null : <Nav {...this.props}/> }
        {
          props.appAlert && props.appAlert.title
          &&
          <div className="alert-container">
            <div className="alert-content">
              <div className="main">
                <h2>{props.appAlert.title}</h2>
                <p>{props.appAlert.body}</p>
              </div>
              <div onClick={() => props.dismissAlert()} className="dismiss">OK</div>
            </div>
          </div>
        }
        <div className={`body ${isWindow ? 'window' : ''}`}>
          <Switch>
            <Route exact path="/" component={MapView}/>
            <Route exact path="/administrators" component={Administrators}/>
            <Route exact path="/stadistics" component={Sites}/>
            <Route exact path="/settings" component={Settings}/>
            <Route exact path="/zones/:zoneId" component={MapView}/>
            <Route exact path="/zones/:zoneId/:subzoneId" component={MapView}/>
            <Route exact path="/zones/:zoneId/:subzoneId/:siteId" component={MapView}/>
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ credentials, appAlert }) {
  return {
    credentials,
    appAlert
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCredentials: user => {
      dispatch(setCredentials(user))
    },
    dismissAlert: () => {
      dispatch(dismissAlert())
    },
    alert: (title, body) => {
      dispatch(alert(title, body))
    },
    setReport: report => {
      dispatch(setReport(report))
    },
    setZone: (id, name, positions) => {
      dispatch(setZone(id, name, positions))
    },
    setSubzone: (zoneId, subzoneId, name, positions) => {
      dispatch(setSubzone(zoneId, subzoneId, name, positions))
    },
    setSite: (zoneId, subzoneId, siteId, key, name, position) => {
      dispatch(setSite(zoneId, subzoneId, siteId, key, name, position))
    }
  }
}

App.propTypes = {
  credentials: PropTypes.object,
  setCredentials: PropTypes.func,
  location: PropTypes.object,
  appAlert: PropTypes.object,
  dismissAlert: PropTypes.func,
  history: PropTypes.object,
  setZone: PropTypes.func,
  setSubzone: PropTypes.func,
  setSite: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
