import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { logout } from '../actions'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: props.credentials.user.fullName,
      email: props.credentials.user.email || '',
      password: 'notmypassword'
    }

    this.onChange = this.onChange.bind(this)
    this.logout = this.logout.bind(this)
  }

  onChange(event) {
    const { name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  logout() {
    localStorage.removeItem('token')
    location.reload()
  }

  render() {
    return (
      <div className="settings">
        <div className="content">
          <form action="">
            <div>
              <label htmlFor="">Usuario</label>
              <input
                type="text"
                value={this.state.fullName}
                onChange={this.onChange}
                name="name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="">Correo electrónico</label>
              <input
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                name="email"
                disabled
              />
            </div>
            <div>
              <label htmlFor="">Contraseña</label>
              <input
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                name="password"
                disabled
              />
            </div>
          </form>
          <div className="restore">
            <input type="checkbox" id="restore-windows"/>
            <label htmlFor="restore-windows">Restaurar ventanas al reiniciar sesión</label>
          </div>
          <span className="button" onClick={this.logout}>Cerrar sesión</span>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ credentials }) {
  return {
    credentials
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(logout())
    }
  }
}

Settings.propTypes = {
  logout: PropTypes.func,
  credentials: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
