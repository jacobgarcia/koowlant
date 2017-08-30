import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

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

  componentWillReceiveProps(nextProps) {
    console.log('Will recieve props', nextProps)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  render() {
    const date = new Date(this.state.time)

    return (
      <nav>
        <div className="user">
          <img src="" alt="" className="logo"/>
          <div className="username">
            <p>{`${this.props.credentials.user.name} ${this.props.credentials.user.surname}`}</p>
            <p>{this.props.credentials.user.permissions}</p>
          </div>
        </div>
        <div>
          <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
          <span>{date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</span>
          <ul className="nav links">
            <li><NavLink exact to="/" activeClassName="selected">Mapa</NavLink></li>
            <li><NavLink to="/administrators" activeClassName="selected">Administradores</NavLink></li>
            <li><NavLink to="/stadistics" activeClassName="selected">Estadísiticas</NavLink></li>
            <li><NavLink to="/settings" activeClassName="selected">Configuración</NavLink></li>
          </ul>
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
