import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Prompt } from '../components'
import { NetworkOperation } from '../lib'
import { toggleDarkMode } from '../actions'

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
      filteredUsers: [],
      isAddingUser: false,
      selectedOption: 'ADMINS',
      userAddSection: 'CONTACT',
      selectedZones: [],
      selectedZone: null,
      selectedSubzones: [],
      query: '',
      isSearching: false
    }

    this.toggleAddUser = this.toggleAddUser.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onLogout = this.onLogout.bind(this)
  }

  componentDidMount() {
    // Get users depending the access of current user
    NetworkOperation.getUsers()
    .then(({data}) => {
      this.setState({
        users: data.users,
        filteredUsers: data.users
      })
    })
  }

  onLogout() {
    localStorage.removeItem('token')
    this.props.history.replace('/login')
  }

  onSearchChange(event) {
    const { value } = event.target
    this.setState({
      filteredUsers: this.state.users.filter(user => JSON.stringify(user).toLowerCase().includes(value.toLowerCase())),
      query: value
    })
  }

  toggleAddUser() {
    this.setState(prev => ({
      isAddingUser: !prev.isAddingUser,
      userAddSection: 'CONTACT'
    }))
  }

  render() {
    const { state, props } = this
    const operators = this.state.filteredUsers.filter(({access}) => access < 3)
    const admins = this.state.filteredUsers.filter(({access}) => access === 3)

    return (
      <div className="app-content users">
        {
          state.isAddingUser
          &&
          <Prompt onDismiss={this.toggleAddUser}>
            <div className="content user-add" onClick={evt => evt.stopPropagation()}>
              <div className="actions">
                <p>Nuevo <span>{this.state.selectedOption === 'ADMINS' ? 'administrador' : 'operador'}</span></p>
                {
                  state.userAddSection === 'CONTACT'
                  ? <span onClick={this.toggleAddUser} className="inline-button">Cancelar</span>
                  : <span onClick={() => this.setState({ userAddSection: 'CONTACT' })} className="inline-button">Regresar</span>
                }
              </div>
              {
                state.userAddSection === 'CONTACT'
                ?
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
                :
                <div className="fields">
                  <label htmlFor="">Permisos</label>
                  <div className="counter" onClick={() => this.setState(prev => ({ showZoneSelector: !prev.showZoneSelector }))}>
                    <span className="value">{state.selectedZones.length}</span>
                    <span className="title">Zonas</span>
                    <ul className={`drop-list ${!state.showZoneSelector && 'hidden'}`} onClick={evt => evt.stopPropagation()}>
                      <li>
                        <input
                          type="checkbox"
                          id="all"
                          name="ALL"
                          onChange={this.onChange}
                        />
                        <label htmlFor="all"><b>Todas</b></label>
                      </li>
                      {
                        props.zones.map(zone =>
                          <li key={zone._id}>
                            <input
                              type="checkbox"
                              id={zone._id}
                              name={zone._id}
                              onChange={this.onChange}
                              checked={this.state.selectedZones.some(zoneId => zoneId === zone._id)}
                            />
                            <label htmlFor={zone._id}> {zone.name}</label>
                          </li>
                        )
                      }
                      {/* <input type="button" className="destructive" value="Aplicar"/> */}
                    </ul>
                  </div>
                  <div className="counter" onClick={() => this.setState(prev => ({ showSubzoneSelector: !prev.showSubzoneSelector }))}>
                    <span className="value">{state.selectedSubzones.length}</span>
                    <span className="title">Subzonas</span>
                    <ul className={`drop-list ${!state.showSubzoneSelector && 'hidden'}`} onClick={evt => evt.stopPropagation()}>
                      <li>
                        <input
                          type="checkbox"
                          id="all"
                          name="ALL"
                          onChange={this.onChange}
                        />
                        <label htmlFor="all"><b>Todas</b></label>
                      </li>
                      {
                        props.zones.map(zone =>
                          <li key={zone._id}>
                            <input
                              type="checkbox"
                              id={zone._id}
                              name={zone._id}
                              onChange={this.onChange}
                              checked={this.state.selectedSubzones.some(zoneId => zoneId === zone._id)}
                            />
                            <label htmlFor={zone._id}> {zone.name}</label>
                          </li>
                        )
                      }
                      {/* <input type="button" className="destructive" value="Aplicar"/> */}
                    </ul>
                  </div>
                </div>
              }
              <input
                type="button"
                className="next destructive"
                value="Siguiente"
                onClick={() => state.userAddSection === 'CONTACT' ? this.setState({userAddSection: 'PERMISSIONS'}) : this.addUser()}
              />
            </div>
          </Prompt>
        }
        <div className="user">
          <div className="user-info">
            <div>
              <span>Nombre</span>
              <p>{props.credentials && props.credentials.user && props.credentials.user.fullName}</p>
            </div>
            <div>
              <span>Email</span>
              <p>{props.credentials && props.credentials.user && props.credentials.user.email}</p>
            </div>
            <div>
              <span>Tipo de usuario</span>
              <p>{props.credentials && props.credentials.user && props.credentials.user.access}</p>
            </div>
            <div>
              <span>Modo obscuro</span>
              <div className="switch white">
                <input type="radio" name="switch" id="switch-off" onChange={props.toggleDarkMode} checked={!props.darkMode} />
                <input type="radio" name="switch" id="switch-on" onChange={props.toggleDarkMode} checked={props.darkMode} />
                <label htmlFor="switch-on">{props.darkMode ? 'Si' : 'No' }</label>
                <span className="toggle" />
              </div>
            </div>
          </div>
          <div>
            <input type="button" value="Cerrar sesión" onClick={this.onLogout}/>
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
            <div className="actions">
              <div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={state.query}
                  className="shrinkable"
                  onChange={this.onSearchChange}
                  onFocus={() => this.setState({isSearching: true})}
                />
                {state.isSearching && <span className="inline-button" onClick={() => {this.setState({isSearching: false, query: ''}); this.onSearchChange({target: {value: ''}})}}>Cancelar</span>}
              </div>
              <input type="button" value="Añadir" onClick={this.toggleAddUser}/>
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

function mapStateToProps({zones, credentials, darkMode}) {
  return {
    zones: zones.map(({name, _id, subzones}) => ({name, _id, subzones: subzones.map(({_id, name}) => ({_id, name}))})),
    credentials,
    darkMode
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDarkMode: () => dispatch(toggleDarkMode())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
