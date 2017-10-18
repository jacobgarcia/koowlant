import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import qs from 'query-string'
import NetworkOperation from '../NetworkOperation'

import { setCredentials } from '../actions'

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      passswordRepeat: '',
      passwordValid: false,
      signupFailed: false,
      invitation: props.match.params.invitation_token
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
    if (name === 'password') this.validatePassword(value)

    if (name === 'email') {
      this.setState({
        isValidEmail: validateEmail(value)
      })
    }
  }

  onSubmit(event) {
    event.preventDefault()

    if (!(this.state.password &&
    this.state.passswordRepeat &&
    this.state.isValidEmail)) return

    // Submit user to API
    const { email, password, fullName } = this.state

    if (this.state.signupFailed) {
      this.setState({
        signupFailed: false
      })
    }

    NetworkOperation.signup(this.state.invitation, email, password, fullName)
    .then(response => {
      const { token, user } = response.data

      this.props.setCredentials(user, token)

      // Get response
      localStorage.setItem('token', token)

      this.props.history.push('/')
    })
    .catch((error) => {
      // TODO: Check status and based on that return information to user
      console.log('Something went wrong: ' + error)
      this.setState({
        signupFailed: true
      })
    })


  }

  validatePassword(password = '') {
    const hasUppercase = (password.match(/[A-Z]/) || []).length > 0
    const hasLowercase = (password.match(/[a-z]/) || []).length > 0
    const hasNumber = (password.match(/\d/) || []).length > 0
    const hasSymbol = (password.match(/[\?\-\&\[\[\]\}\{\+\<\>\\\.\=\:\/\@\^\*\%\$\#\~\`\;\(\)\|\!\¡\¿\÷\,\_\'\"]/) || []).length > 0

    this.setState({
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol
    })
  }

  getPasswordMissings() {
    const elements = []
    if (!this.state.hasUppercase) elements.push(<span key="upper">La contraseña debe tener una o más letras en mayúsculas</span>)
    if (!this.state.hasLowercase) elements.push(<span key="lower">La contraseña debe tener una o más letras en minúsculas</span>)
    if (!this.state.hasNumber) elements.push(<span key="number">La contraseña debe tener una o más números</span>)
    if (!this.state.hasSymbol) elements.push(<span key="symbol">La contraseña debe tener una o más símbolos</span>)

    return elements
  }

  render() {
    return (
      <div className="login">
        <img src="/static/img/iso.svg" alt="" className="iso"/>
        <img src="/static/img/logo.svg" alt="" className="logo"/>
        <div className="content">
          <form onSubmit={this.onSubmit}>
            <input
              id="name"
              type="text"
              onChange={this.onChange}
              value={this.state.name}
              name="name"
              placeholder="Nombre completo"
            />
            <input
              id="email"
              type="text"
              onChange={this.onChange}
              value={this.state.email}
              name="email"
              placeholder="Correo electrónico"
            />
            <input
              id="password"
              type="password"
              onChange={this.onChange}
              value={this.state.password}
              name="password"
              placeholder="Contraseña"
            />
            <input
              type="password"
              onChange={this.onChange}
              value={this.state.passswordRepeat}
              name="passswordRepeat"
              placeholder="Confirmar Contraseña"
            />
            {
              (this.state.password !== this.state.passswordRepeat && this.state.passswordRepeat !== '')
              &&
              <span>Las contraseñas no coinciden</span>
            }
            {
              (this.state.password !== '')
              &&
              <div>
                  {this.getPasswordMissings()}
              </div>
            }
            <input
              type="submit"
              value="Registrarse"
              className={
                (this.state.password &&
                this.state.passswordRepeat &&
                this.state.isValidEmail &&
                this.state.password === this.state.passswordRepeat)
                ? 'active'
                : 'invalid'
              }
            />
            {
              this.state.loginFailed
              && <div className="small-error">Correo electrónico o contraseña incorrectos</div>
            }
          </form>
        </div>
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

Signup.propTypes = {
  setCredentials: PropTypes.func,
  match: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
