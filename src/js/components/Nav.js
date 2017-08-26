import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Nav(props) {
  return (
    <nav>
      <img src="" alt="" className="logo"/>
      <div>
        <span>30/08/2017</span>
        <span>17:05</span>
        <ul className="links">
          <li>Administradores</li>
          <li>Estadísiticas</li>
          <li>Configuración</li>
        </ul>
      </div>
    </nav>
  )
}

Nav.propTypes = {
  // user: PropTypes.obj
}

export default Nav
