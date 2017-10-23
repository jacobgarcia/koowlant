import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { setCredentials } from '../actions'
import NetworkOperation from '../NetworkOperation'

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: '',
      password: '',
      loginFailed: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()

    if (!this.state.isValidEmail) return

    const { user, password } = this.state

    this.state.loginFailed
    &&
    this.setState({
      loginFailed: false
    })

    NetworkOperation.login(user, password)
    .then(response => {
      const { token, user } = response.data

      // Get response
      localStorage.setItem('token', token)
      this.props.setCredentials(user, token)

      this.props.history.push('/')
    })
    .catch(() => {

      this.setState({
        loginFailed: true
      })

    })


  }

  onChange(event) {
    const { name, value } = event.target

    this.state.loginFailed
    &&
    this.setState({
      loginFailed: false
    })

    if (name === 'user') {
      this.setState({
        isValidEmail: validateEmail(value)
      })
    }

    this.setState({
      [name]: value
    })
  }

  render() {
    const token = localStorage.getItem('token')
    const hasToken = token !== null && token !== '' && token !== 'null'

    if (hasToken) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div className="login">
        <img src="/static/img/iso.svg" alt="" className="iso"/>
        <img src="/static/img/logo.svg" alt="" className="logo"/>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            onChange={this.onChange}
            value={this.state.user}
            name="user"
            placeholder="Correo electrónico"
          />
          <input
            type="password"
            onChange={this.onChange}
            value={this.state.password}
            name="password"
            placeholder="Contraseña"
          />
          <input
            type="submit"
            value="Iniciar sesión"
            className={
              this.state.password && this.state.isValidEmail
              ? 'active'
              : 'invalid'
            }
          />
          {
            this.state.loginFailed
            && <div className="small-error">Correo electrónico o contraseña incorrectos</div>
          }
          <Link to="/restore-password">Recuperar contraseña</Link>
        </form>
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return {
    auth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCredentials: user => {
      dispatch(setCredentials(user))
    }
  }
}

Login.propTypes = {
  setCredentials: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
