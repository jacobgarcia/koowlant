import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Login from './containers/Login'
import Signup from './containers/Signup'
import Streaming from './components/StreamFlashless'

import App from './containers/App'

import appReducer from './reducers'

const store = createStore(appReducer)

const videoJsOptions = {
  autoplay: true,
  controls: false,
  sources: [{
    src: 'rtmp://demo.kawlantid.com/live&idiots',
    type: 'rtmp/mp4'
  }]
}

function Routes() {
  return (
    <Provider store={store}>
      <Router>
        <div id="app">
          <Switch>
            <Route path="/streaming" component={Streaming} />
            <Route path="/login" component={Login}/>
            <Route path="/signup/:invitation_token" component={Signup}/>
            <Route path="/" component={App} />
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default Routes
