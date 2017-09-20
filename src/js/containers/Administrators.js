import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Administrators extends Component {
  constructor(props) {
    super(props)

    const zoneAdministrators = this.props.administrators

    this.state = {
      zoneAdministrators
    }

  }

  render() {
    return (
      <div className="administrators">
        <div className="header">
          <h3>11 Administradores</h3>
          <span className="button">Agregar administrador</span>
        </div>
        <div>
          <span>Zona</span>
          <select name="Todas las zonas" id=""></select>
        </div>
        <div className="zone-container">
          {
            this.state.zoneAdministrators.map((zone, index) =>
              <div className="zone" key={index}>
                <div className="zone-name">Zona {zone.name}</div>
                {
                  zone.administrators.map((administrator, index) =>
                    <div className="admin" key={index}>
                      <div className="names">
                        <p className="name">Nombre del administrador</p>
                        <p>administrador@mail.com</p>
                      </div>
                      <div className="permits">
                        <p>Permisos</p>
                        <p>Monitoreando</p>
                      </div>
                      <div className="chat">
                        <span className="button">Chat</span>
                        <p>activo</p>
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ administrators }) {
  return {
    administrators
  }
}

Administrators.propTypes = {
  administrators: PropTypes.array
}

export default connect(mapStateToProps)(Administrators)
