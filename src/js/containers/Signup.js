import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: 'email@dominio.com',
      password: '',
      passswordRepeat: '',
      passwordValid: false
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
  }

  componentWillMount() {
    const { token } = qs.parse(this.props.location.search)
    console.log('Got token', token)
    // TODO: validate token with API
    // if it's continue, other display invalid invitation message
  }

  onSubmit(event) {
    event.preventDefault()

    if (!(this.state.password &&
    this.state.passswordRepeat &&
    this.state.isValidEmail)) return

    // TODO: Submit user to API
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
    let elements = []
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
        <div className="content">
          <h1>Completa tu registro</h1>
          <form onSubmit={this.onSubmit}>
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              onChange={this.onChange}
              value={this.state.name}
              name="text"
              placeholder="Nombre completo"
              readOnly
            />
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="text"
              onChange={this.onChange}
              value={this.state.email}
              name="email"
              placeholder="Correo electrónico"
            />
            <label htmlFor="password">Contraseña</label>
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
              placeholder="Repetir contraseña"
            />
            {
              (this.state.password !== this.state.passswordRepeat && this.state.passswordRepeat !== '')
              ?
              <span>Las contraseñas no coinciden</span>
              : <div>
                  {this.getPasswordMissings()}
                </div>
            }
            <input
              type="submit"
              value="Registrarse"
              className={
                (this.state.password &&
                this.state.passswordRepeat &&
                this.state.isValidEmail)
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

export default Signup
