import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { getAdminString } from '../Decoder'

class Nav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: Date.now()
    }

    this.tick = this.tick.bind(this)
  }

  tick() {
    this.setState(prevState => ({
      time: prevState.time + 1000
    }))
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  render() {
    const date = new Date(this.state.time)

    const isZone = this.props.location.pathname.includes('zones')

    return (
      <nav>
        <div className="user">
          <img src="/static/uploads/logo.png" alt="" className="logo"/>
          <div className="username">
            <p>{`${this.props.credentials.user.name} ${this.props.credentials.user.surname}`}</p>
            <p>{getAdminString(this.props.credentials.user.permissions)}</p>
          </div>
        </div>
        <div className="navigation">
          <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
          <span>{date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</span>
          <ul className="nav links">
            <li><NavLink exact to="/" activeClassName="selected" className={isZone && 'selected'}>Mapa</NavLink></li>
            <li><NavLink to="/administrators" activeClassName="selected">Administradores</NavLink></li>
            <li><NavLink to="/stadistics" activeClassName="selected">Estadísiticas</NavLink></li>
            <li><NavLink to="/settings" activeClassName="selected">Configuración</NavLink></li>
          </ul>
          <img className="logo mini" src="/static/img/iso.svg" alt=""/>
        </div>
      </nav>
    )
  }
}

Nav.propTypes = {
  credentials: PropTypes.object
}

function mapStateToProps({ credentials }) {
  return {
    credentials
  }
}

export default connect(mapStateToProps)(Nav)
