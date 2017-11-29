import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { NetworkOperation } from '../lib'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      isAddingUser: false
    }
  }

  componentDidMount() {
    NetworkOperation.getUsers()
    .then(({data}) => {
      this.setState({
        users: data.users
      })
    })
  }

  addUser() {
    this.setState({
      isAddingUser: true
    })
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content users">
        {
          state.isAddingUser
          &&
          <div className=""></div>
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
          <div>
            <input type="button" value="Añadir" onClick={this.addUser}/>
            <input type="button" value="Filtrar"/>
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
                state.users.map(user =>
                  <div className="table-element" key={user._id}>
                    <div>{user.name} {user.surname}</div>
                    <div>{user.email}</div>
                    <div className="small">
                      <input type="button" value="Asignar"/>
                      <ul className="drop-list">
                        <li><input type="checkbox" id={user._id}/><label htmlFor={user._id}>Todas</label></li>
                        {
                          props.zones.map(zone =>
                            <li key={zone._id}>
                              <input type="checkbox" id={user._id + zone._id}/>
                              <label htmlFor={user._id + zone._id}> {zone.name}</label>
                            </li>
                          )
                        }
                      </ul>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({zones}) {
  return {
    zones: zones.map(({name, _id, subzones}) => ({name, _id, subzones: subzones.map(({_id, name}) => ({_id, name}))}))
  }
}

export default connect(mapStateToProps)(Users)
