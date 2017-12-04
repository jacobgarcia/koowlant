import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setCredentials, setComplete, setLoading, setExhaustive, setReport } from '../actions'
import { NetworkOperation } from '../lib'
import { Map, Users, Stats } from './'
import { Nav } from '../components'
import io from 'socket.io-client'

class App extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token')
    const path = `${this.props.location.pathname}${this.props.location.search}`

    if (!token) {
      localStorage.removeItem('token')
      this.props.history.replace(`/login?return=${path}`)
      return
    }

    this.props.setLoading()

    NetworkOperation.getSelf()
    .then(({data}) => {
      this.props.setCredentials({...data.user, token})

      // Start socket connection
      this.initSocket(this.props, token)

      return NetworkOperation.getExhaustive()
    })
    .then(({data}) => {
      // Set all zones
      this.props.setExhaustive(data.zones)

      this.props.setComplete()
    })
    .catch(({response}) => {
      this.props.setComplete()

      switch (response.status) {
        case 401:
        case 400:
          this.props.history.replace(`/login?return=${path}`)
          break
        default:
          // TODO Display error
          break
      }
    })
  }

  componentDidCatch(error, info) {
    // TODO Display fallback UI
    console.log('APP ERROR', error)
    // TODO You can also log the error to an error reporting service
    // logErrorToMyService(error, info)
  }

  initSocket(props, token) {
    this.socket = io()
    // this.socket.emit('join', token)

    this.socket.on('connect', () => {
      console.log('connected')
      this.socket.emit('join', token)
    })

    this.socket.on('reload', () => {
      console.log('Got reload')
    })

    this.socket.on('report', props.setReport)
  }

  render() {
    const { props } = this
    return (
      <div id="app">
        <Nav
          pathname={props.location.pathname}
          loading={props.loading}
          credentials={props.credentials}
        />
        <Switch>
          <Route exact path="/" component={Map} />
          <Route path="/zones/:zoneId?/:subzoneId?/:siteId?" component={Map} />
          <Route path="/users" component={Users} />
          <Route path="/statistics" component={Stats} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  setCredentials: PropTypes.func,
  setComplete: PropTypes.func,
  setLoading: PropTypes.func,
  history: PropTypes.object,
  setExhaustive: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    setReport: report => {
      dispatch(setReport(report))
    },
    setCredentials: user => {
      dispatch(setCredentials(user))
    },
    setLoading: () => {
      dispatch(setLoading())
    },
    setComplete: () => {
      dispatch(setComplete())
    },
    setExhaustive: zones => {
      dispatch(setExhaustive(zones))
    }
  }
}

function mapStateToProps({loading, credentials}) {
  return {
    loading,
    credentials
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
