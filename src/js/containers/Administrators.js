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
          <h3>11 Administradores</h3>
          <span className="button">Buscar</span>
          <span className="button">Administrador</span>
        </div>
        <div>
          <div>Zonas</div>
          <div>Zona A</div>
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
