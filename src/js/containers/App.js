import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'query-string'

import { setCredentials } from '../actions'
import Sites from './Sites'
import NoMatch from './NoMatch'
import MapView from './Map'
import Settings from './Settings'
import Nav from '../components/Nav'

function authenticate({setCredentials}) {
  const user = {
    name: 'John',
    surname: 'Appleseed',
    token: 'e293je823',
    permissions: 0
  }

  const token = 'kasjndjaksndin39'
  localStorage.setItem('token', token)

  setCredentials(user, token)
}

function App(props) {
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

  const {isWindow} = qs.parse(props.location.search)

  return (
    <div id="app-content">
      { isWindow ? null : <Nav /> }
      <div className={`body ${isWindow ? 'window' : ''}`}>
        <Switch>
          <Route exact path="/" component={MapView}/>
          <Route exact path="/administrators" component={Sites}/>
          <Route exact path="/stadistics" component={Sites}/>
          <Route exact path="/settings" component={Settings}/>
          <Route exact path="/zones/:zoneId" component={MapView}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    </div>
  )
}

function mapStateToProps({ credentials }) {
  return {
    credentials
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCredentials: user => {
      dispatch(setCredentials(user))
    }
  }
}

App.propTypes = {
  credentials: PropTypes.object,
  setCredentials: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
