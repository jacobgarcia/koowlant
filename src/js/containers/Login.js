import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { NetworkOperation } from '../lib'
import { setCredentials } from '../actions'

class Login extends Component {
  constructor(props) {
    super(props)

    const { return: returnUrl = null } = queryString.parse(location.search)

    this.state = {
      email: '',
      password: '',
      return: returnUrl,
      error: null
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const { value, name } = event.target

    this.setState({
      [name]: value,
      error: null
    })
  }

  onSubmit(event) {
    event.preventDefault()

    const { email, password } = this.state

    NetworkOperation.login({ email, password })
    .then(({data}) => {
      localStorage.setItem('token', data.token)

      this.props.setCredentials({...data.user, token: data.token})

      this.props.history.replace(this.state.return || '/')
    })
    .catch(({response = {}}) => {
      const { status = 500 } = response
      switch (status) {
        case 400:
        case 401:
          this.setState({
            error: 'Correo o contraseña incorrectos'
          })
          break
        default:
          this.setState({
            error: 'Problemas al iniciar sesión, intenta nuevamente'
          })
      }
    })
  }

  render() {
    const { state } = this
    return (
      <div className="login">
        <div id="logo">
          <img src="/static/img/iso.svg" alt="" className="iso" />
          <img src="/static/img/logo.svg" alt="" className="logo" />
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="email"
            onChange={this.onChange}
            value={state.email}
            placeholder="Correo electrónico"
            required
          />
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={state.password}
            placeholder="Contraseña"
            required
          />
          <input type="submit" value="Listo" className={`button destructive ${(!state.email || !state.password) && 'disabled' }`} />
          {
            state.error
            &&
            <div className="error">
              <p>{state.error}</p>
            </div>
          }
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  setCredentials: PropTypes.func,
  history: PropTypes.object
}

function mapDispatchToProps(dispatch) {
  return {
    setCredentials: user => {
      dispatch(setCredentials(user))
    },
  }
}

export default connect(null, mapDispatchToProps)(Login)
