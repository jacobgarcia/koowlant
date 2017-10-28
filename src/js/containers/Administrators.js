import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import NetworkOperation from '../NetworkOperation'

class Administrators extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingAdmin: false,
      selectedZone: '', // Will contain _id
      selectedSubzone: '', // Will contain _id
      monitoringCameras: false,
      monitoringSensors: false,
      grantedPermits: false,
      email: ''
    }

    this.onAddAdministrator = this.onAddAdministrator.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onPermitsChange = this.onPermitsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onAddAdministrator() {
    this.setState({
      isAddingAdmin: true
    })
  }

  handleChange(event) {
    const { value, name } = event.target
    this.setState({
      [name]: value
    })
  }

  onPermitsChange(event) {
    this.setState({
      grantedPermits: event.target.checked
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { email, selectedSubzone, selectedZone, grantedPermits, monitoringCameras, monitoringSensors } = this.state
    console.log(email, selectedSubzone, selectedZone, grantedPermits, monitoringCameras, monitoringSensors)

    NetworkOperation.invite(email, this.props.credentials.user.company, this.props.credentials.user.email)
    .then(response => {
      const { zones } = response.data
      // set each zone
      zones.forEach((zone) => {
        this.props.setZone(zone._id, zone.name, zone.positions)
      })
    })
    .catch((error) => {
      // Dumb catch
      console.log('Something went wrong:' + error)
    })
    // After network operation
    this.setState({
      isAddingAdmin: false
    })
  }

  render() {
    return (
      <div className="administrators" >
        {
          this.state.isAddingAdmin
          &&
          <div className="add-admin" onClick={event => event.stopPropagation()}>
            <div className="content">
              <form onSubmit={this.handleSubmit}>
                <div className="section inline no-space space-between">
                  <h4>Agregar administrador</h4>
                  <span className="action" onClick={() => this.setState({isAddingAdmin: false})}>Cancelar</span>
                </div>
                <div className="section">
                  <div className="inline space-right">
                    <label htmlFor="email-add">Email:</label>
                    <input
                      type="email"
                      id="email-add"
                      placeholder="usuario@dominio.com"
                      value={this.state.email}
                      name="email"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="inline space-around grow">
                    <div style={{display: 'flex'}}>
                      <label htmlFor="zone-add" style={{marginRight: 10}}>Zona: </label>
                      <select style={{flexGrow: 1}} name="selectedZone" id="zone-add" onChange={this.handleChange} value={this.state.selectedZone}>
                        <option />
                        {
                          this.props.zones.map(zone =>
                            <option value={zone._id} key={zone._id}>{zone.name}</option>
                          )
                        }
                      </select>
                    </div>
                    <div style={{display: 'flex', marginLeft: 20}}>
                      <label htmlFor="subzone-add" style={{marginRight: 10}}>Subzona: </label>
                      <select style={{flexGrow: 1}} name="selectedSubzone" id="subzone-add" onChange={this.handleChange} value={this.state.selectedSubzone}>
                        <option />
                        {
                          this.state.selectedZone
                          &&
                          this.props.zones.filter(({_id}) => _id === this.state.selectedZone).pop().subzones.map(zone =>
                            <option value={zone._id} key={zone._id}>{zone.name}</option>
                          )
                        }
                      </select>
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h5>Monitoreo</h5>
                  <div className="inline space-right">
                    <span
                      className={`button ${this.state.monitoringCameras && 'selected'}`}
                      onClick={() => this.setState(prevState => ({monitoringCameras: !prevState.monitoringCameras}))}>Cámaras</span>
                    <span
                      className={`button ${this.state.monitoringSensors && 'selected'}`}
                      onClick={() => this.setState(prevState => ({monitoringSensors: !prevState.monitoringSensors}))}>Sensores</span>
                  </div>
                </div>
                <div className="section">
                  <h5>Permisos</h5>
                  <div className="inline">
                    <div className="permits-wrapper">
                      <input
                        type="checkbox"
                        id="permits-add"
                        value={this.state.grantedPermits}
                        onChange={this.onPermitsChange}
                      />
                      <label className="permits" htmlFor="permits-add"/>
                    </div>
                    <label htmlFor="permits-add">{this.state.grantedPermits ? 'Con permisos' : 'Sin permisos' }</label>
                  </div>
                </div>
                <input type="submit" className="add" value="Agregar"/>
              </form>

            </div>
          </div>
        }
        <div className="header">
          <h4>11 Administradores</h4>
          <ul className="links">
            <li className="big search">Buscar</li>
            <li className="big create" onClick={this.onAddAdministrator}>Administrador</li>
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

function mapStateToProps({ credentials, administrators, zones }) {
  return {
    credentials,
    administrators,
    zones
  }
}

Administrators.propTypes = {
  credentials: PropTypes.object,
  administrators: PropTypes.array,
  zones: PropTypes.array
}

export default connect(mapStateToProps)(Administrators)
