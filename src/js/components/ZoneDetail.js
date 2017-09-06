import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { StatusOverall, ZonesContainer } from './'
import { getStatus } from '../SpecialFunctions'

class ZoneDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewStyle: 'list'
    }

    this.changeSitesView = this.changeSitesView.bind(this)
  }

  changeSitesView(viewStyle) {
    this.setState({ viewStyle })
  }

  onHover(subZoneId) {
    console.log(subZoneId)
  }

  render() {
    const { completeStatus, normalPercentage } = getStatus(this.props.zone.status)

    return (
      <div className="side-content">
        <div className="top">
          <span className="back"><Link to="/">Regresar</Link></span>
          { this.props.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
        </div>
        <StatusOverall
          status={completeStatus}
        />
        <div>
          <div>
            Sensores
            Cámaras
          </div>
          <ZonesContainer
            zones={this.props.zone.subZones}
            changeSitesView={this.changeSitesView}
            viewStyle={this.state.viewStyle}
            onHover={this.onHover}
            subZones
          />
        </div>
      </div>
    )
  }
}

export default ZoneDetail
