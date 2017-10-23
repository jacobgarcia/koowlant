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

import NetworkOperation from '../NetworkOperation'

const socket = io() // window.location

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  componentWillMount() {
    const token = localStorage.getItem('token')
    this.setState({
      isLoading: true
    })

    if (!token){
      this.props.history.push('/login')
      return
    }

    NetworkOperation.getProfile()
    .then((response) => {
      const user = response.data.user

      localStorage.setItem('user', JSON.stringify(user))
      this.props.setCredentials(user)

      this.setState({
        isLoading: false
      })
    })
    .catch((error) => {
      // ENHACEMENT handle better this error
      console.log(error)
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

    const { isWindow } = qs.parse(props.location.search)

    // TODO: Improve this render method for loading
    if (this.state.isLoading) {
        return <h2>Loading</h2>
    }

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
