import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/">Mapa</Link>
      </div>
    )
  }
}

Dashboard.propTypes = {

}

export default Dashboard
