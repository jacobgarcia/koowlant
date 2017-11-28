import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
    const { state } = this

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
                    <div className="small"></div>
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

export default Users
