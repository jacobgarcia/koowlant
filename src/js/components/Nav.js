import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'
// import PropTypes from 'prop-types'

class Nav extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      date: Date.now()
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    this.setState(prev => ({
      date: prev.date + 1000
    }))
  }

  render() {
    const { props, state } = this
    const date = new Date(state.date)

    return (
      <nav>
        <div className="user">
          <img src="/static/img/connus.png" alt="Logo"/>
          {
            (props.credentials.user && props.credentials.company)
            &&
            <div className="user-info">
              <span>{props.credentials.user && props.credentials.user.fullName}</span>
              <span className="company">Usuario {props.credentials.company && props.credentials.company.name}</span>
            </div>
          }
        </div>
        <ul>
          <li><NavLink exact to="/" isActive={() => props.pathname === '/' || props.pathname.split('/').some(element => element === 'zones')}>Mapa</NavLink></li>
          <li><NavLink to="/statistics">Estadísticas</NavLink></li>
          <li><NavLink to="/users">Usuarios</NavLink></li>
        </ul>
        <div className="status">
          <span className="date">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
          <span className="time">{date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</span>
          <span id="spinner" className={props.loading ? 'active' : ''} />
        </div>
      </nav>
    )
  }
}

export default Nav
