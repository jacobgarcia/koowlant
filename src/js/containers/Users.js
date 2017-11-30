import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Prompt } from '../components'
import { NetworkOperation } from '../lib'

class User extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showZones: false,
      selectedZones: []
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const { name, checked } = event.target
    const selectedZones = this.state.selectedZones

    if (name === 'ALL') {
      checked
      ?
      this.setState({
        selectedZones: this.props.zones.reduce((sum, {_id}) => [...sum, _id], [])
      })
      :
      this.setState({
        selectedZones: []
      })
      return
    }

    selectedZones.some(zoneId => zoneId === name)
    ?
    this.setState(prevState => ({
      selectedZones: prevState.selectedZones.filter(zoneId => zoneId !== name)
    }))
    :
    this.setState(prev => ({
      selectedZones: prev.selectedZones.concat([name])
    }))

  }

  render() {
    const { user, zones } = this.props
    return (
      <div className="table-element">
        <div>{user.name} {user.surname}</div>
        <div>{user.email}</div>
        <div className="small">
          <input type="button" value="Asignar" onClick={() => this.setState(prev => ({ showZones: !prev.showZones }))}/>
          {
            this.state.showZones
            &&
            <ul className="drop-list">
              {/* <li>
                <input type="checkbox" id={user._id} name="ALL" onChange={this.onChange} />
                <label htmlFor={user._id}><b>Todas</b></label>
              </li> */}
              {
                zones.map(zone =>
                  <li key={zone._id}>
                    <input
                      type="checkbox"
                      id={user._id + zone._id}
                      name={zone._id}
                      onChange={this.onChange}
                      checked={this.state.selectedZones.some(zoneId => zoneId === zone._id)}
                    />
                    <label htmlFor={user._id + zone._id}> {zone.name}</label>
                  </li>
                )
              }
            </ul>
          }
        </div>
      </div>
    )
  }
}

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      isAddingUser: false,
      selectedOption: 'ADMINS'
    }

    this.toggleAddUser = this.toggleAddUser.bind(this)
  }

  componentDidMount() {
    // Get users depending the access of current user
    NetworkOperation.getUsers()
    .then(({data}) => {
      this.setState({
        users: data.users
      })
    })
  }

  toggleAddUser() {
    this.setState(prev => ({
      isAddingUser: !prev.isAddingUser
    }))
  }

  render() {
    const { state, props } = this
    const operators = this.state.users.filter(({access}) => access < 3)
    const admins = this.state.users.filter(({access}) => access === 3)

    return (
      <div className="app-content users">
        {
          state.isAddingUser
          &&
          <Prompt onDismiss={this.toggleAddUser}>
            <div className="content user-add" onClick={evt => evt.stopPropagation()}>
              <div className="actions">
                <p>Nuevo <span>{this.state.selectedOption === 'ADMINS' ? 'administrador' : 'operador'}</span></p>
                <span onClick={this.toggleAddUser}>Cancelar</span>
              </div>
              <div className="fields">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                />
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                />
                <span className="description">A este email se le hará llegar una invitación que deberá aceptar para poder accesar.</span>
              </div>
              <input type="button" className="next destructive" value="Siguiente"/>
            </div>
          </Prompt>
        }
        <div className="user">
          <div className="user-info">
            <div>
              <span>Administrador Principal</span>
              <p>Adrián González Martinez</p>
            </div>
            <div>
              <span>Email</span>
              <p>adrián.gonzales@mail.com</p>
            </div>
          </div>
          <div>
            <p>Cerrar sesión</p>
          </div>
        </div>
        <div className="users-container">
          {
            props.credentials.user && props.credentials.user.access === 3
            &&
            <ul className="mini-nav">
              <li className={this.state.selectedOption === 'ADMINS' ? 'active' : '' } onClick={() => this.setState({selectedOption: 'ADMINS'})}>Administradores</li>
              <li className={this.state.selectedOption === 'OPERATORS' ? 'active' : '' } onClick={() => this.setState({selectedOption: 'OPERATORS'})}>Operadores</li>
            </ul>
          }
          <div className="users-table">
            <div>
              <input type="button" value="Añadir" onClick={this.toggleAddUser}/>
              <input type="text" placeholder="Buscar..." />
            </div>
            <div className="table">
              <div className="table-header">
                <div className="table-element">
                  <div>Nombre</div>
                  <div>Correo</div>
                  <div className="small">Monitoreo</div>
                </div>
              </div>
              <div className="table-body">
                {
                  (props.credentials.user && props.credentials.user.access === 3)
                  ?
                  (
                    state.selectedOption === 'ADMINS'
                    ?
                    admins.map(user =>
                      <User
                        key={user._id}
                        user={user}
                        zones={props.zones}
                      />
                    )
                    :
                    operators.map(user =>
                      <User
                        key={user._id}
                        user={user}
                        zones={props.zones}
                      />
                    )
                  )
                  :
                  operators.map(user =>
                    <User
                      key={user._id}
                      user={user}
                      zones={props.zones}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({zones, credentials}) {
  return {
    zones: zones.map(({name, _id, subzones}) => ({name, _id, subzones: subzones.map(({_id, name}) => ({_id, name}))})),
    credentials
  }
}

export default connect(mapStateToProps)(Users)
