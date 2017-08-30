import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <form action="">
          <div>
            <label htmlFor="">Usuario</label>
            <input type="text" />
          </div>
          <div>
            <label htmlFor="">Correo electrónico</label>
            <input type="text" />
          </div>
          <div>
            <label htmlFor="">Contraseña</label>
            <input type="text" />
          </div>
        </form>
        <label htmlFor="restore-windows">Restaurar ventanas al iniciar sesión</label>
        <input type="checkbox" id="restore-windows"/>
        <span className="button">Cerrar sesión</span>
      </div>
    )
  }
}

export default Settings
