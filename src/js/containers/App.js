import React from 'react'
// import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { setUser } from '../actions'
import Dashboard from './Dashboard'
import Sites from './Sites'
import NoMatch from './NoMatch'
import MapView from './Map'
import Nav from '../components/Nav'

function App(props) {
  const isAuthenticated = props.auth.authenticated
  const hasToken = localStorage.getItem('token') !== null

  if (!isAuthenticated && !hasToken) {
    return (
      <Redirect to="/login" />
    )
  }

  return (
    <div id="app-content">
      <Nav />
      <div className="body">
        <Switch>
          <Route exact path="/" component={MapView}/>
          <Route exact path="/sites" component={Sites}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    </div>
  )
}

function mapStateToProps({ auth }) {
  return {
    auth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => {
      dispatch(setUser(user))
    }
  }
}

// App.propTypes = {
//   auth: PropTypes.obj
// }

export default connect(mapStateToProps, mapDispatchToProps)(App)
