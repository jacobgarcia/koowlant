import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: props.credentials.user.name + ' ' + props.credentials.user.surname,
      email: props.credentials.email,
      password: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const { name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  logout() {
    console.log('Logging out...')
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
              />
            </div>
            <div>
              <label htmlFor="">Correo electrónico</label>
              <input
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                name="email"
              />
            </div>
            <div>
              <label htmlFor="">Contraseña</label>
              <input
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                name="password"
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

export default connect(mapStateToProps)(Settings)
