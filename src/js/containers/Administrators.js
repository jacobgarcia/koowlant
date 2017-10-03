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
          <h4>11 Administradores</h4>
          <ul className="links">
            <li className="big search">Buscar</li>
            <li className="big create">Administrador</li>
          </ul>
        </div>
        <div className="table-header">
          <span>Zonas</span>
          <div className="zones-header">
            <span>Subzona</span>
            <div className="subzones-header">
              <span>Nombre</span>
              <span>Email</span>
              <span>Monitorear</span>
              <div className="permits">
                <span>Permisos</span>
              </div>
            </div>
          </div>
        </div>
        <div className="zone-container">
          <h4>Zona A</h4>
          <div className="subzones">
            <div className="subzone-container">
              <h4>Subzona A</h4>
              <div className="subzone-admins">
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-1"/><label className="permits" htmlFor="permits-1"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-2"/><label className="permits" htmlFor="permits-2"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-3"/><label className="permits" htmlFor="permits-3"/></div>
                </div>
              </div>
            </div>
            <div className="subzone-container">
              <h4>Subzona B</h4>
              <div className="subzone-admins">
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-4"/><label className="permits" htmlFor="permits-4"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-5" defaultChecked/><label className="permits" htmlFor="permits-5"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-6" defaultChecked/><label className="permits" htmlFor="permits-6"/></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="zone-container">
          <h4>Zona B</h4>
          <div className="subzones">
            <div className="subzone-container">
              <h4>Subzona A</h4>
              <div className="subzone-admins">
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-7"/><label className="permits" htmlFor="permits-7"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-8" defaultChecked/><label className="permits" htmlFor="permits-8"/></div>
                </div>
                <div className="admin">
                  <span>Nombre del administrador</span>
                  <span>nombre@dominio.com</span>
                  <div>
                    <span>Sensores</span>
                    <span>Cámaras</span>
                  </div>
                  <div className="permits-wrapper"><input type="checkbox" id="permits-9"/><label className="permits" htmlFor="permits-9"/></div>
                </div>
              </div>
            </div>
          </div>
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
