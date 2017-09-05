import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { setCredentials } from '../actions'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: '',
      password: ''
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()

    // Dumb login
    const user = {
      name: 'John',
      surname: 'Appleseed',
      token: 'e293je823',
      permissions: 0
    }

    const token = 'kasjndjaksndin39'

    this.props.setCredentials(user, token)

    // Get response
    localStorage.setItem('token', token)

    this.props.history.push('/')
  }

  onChange(event) {
    const { name, value } = event.target

    this.setState({
      [name]: value
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('auth', nextProps.auth.authenticated)
  //   console.log(nextProps.match)
  // }

  render() {
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
            placeholder="Usuario o correo"
          />
          <input
            type="password"
            onChange={this.onChange}
            value={this.state.password}
            name="password"
            placeholder="Contraseña"
          />
          <input type="submit" value="Iniciar sesión"/>
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
