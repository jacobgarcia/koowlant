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

    console.log(this.state.zoneAdministrators)
  }

  render() {
    return (
      <div>
        <div>
          <h3>11 Administradores</h3>
          <span className="button">Agregar administrador</span>
        </div>
        <div>
          <span>Zona</span>
        </div>
        <div>
          {
            this.state.zoneAdministrators.map(zone =>
              <div className="zone" key={zone._id}>
                <div>Zona {zone.name}</div>
                {
                  zone.administrators.map(administrator =>
                    <div className="admin" key={administrator._id}>
                      <p>Nombre del administrador</p>
                      <p>administrador@mail.com</p>
                      <p>Permisos</p>
                      <p>Monitoreando</p>
                      <span className="button">Chat</span>
                      <p>activo</p>
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
