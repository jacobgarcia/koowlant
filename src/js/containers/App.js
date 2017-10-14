import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'query-string'

import { setCredentials, alert, dismissAlert, setReport } from '../actions'
import Sites from './Sites'
import NoMatch from './NoMatch'
import MapView from './Map'
import Administrators from './Administrators'
import Settings from './Settings'
import Nav from '../components/Nav'
import io from 'socket.io-client'

const socket = io() // window.location

function authenticate({setCredentials}) {
  const user = {
    name: 'John',
    surname: 'Appleseed',
    token: 'e293je823',
    email: 'john.a@apple.com',
    permissions: 0
  }

  const token = 'kasjndjaksndin39'
  localStorage.setItem('token', token)

  setCredentials(user, token)
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }

    console.log('App contructor')
  }
  componentWillMount() {
    this.initSocket(this.props)
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    })
  }

  initSocket(props) {

    socket.connect(status => {
    })

    socket.on('connect', () => {
      socket.emit('join', '0293j4ji')
    })

    // socket.on('hey', (message) => {
    //   console.log(message)
    // })

    socket.on('report', report => {
      props.setReport(report)
    })
  }

  render() {
    const props = this.props
    const token = localStorage.getItem('token')
    const hasToken = token !== null && token !== '' && token !== 'null'

    if (!hasToken) {
      return (
        <Redirect to="/login" />
      )
    }

    if (!props.credentials.user) {
      authenticate(props)
    }

    const { isWindow } = qs.parse(props.location.search)

    return (
      <div id="app-content">
        { isWindow ? null : <Nav {...props}/> }
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
    }
  }
}

App.propTypes = {
  credentials: PropTypes.object,
  setCredentials: PropTypes.func,
  location: PropTypes.object,
  appAlert: PropTypes.object,
  dismissAlert: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
