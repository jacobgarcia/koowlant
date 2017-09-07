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

  onHover(subzoneId) {
    console.log(subzoneId)
  }

  render() {
    console.log(this.props)
    const { completeStatus, normalPercentage } = this.props.isZone ? getStatus(this.props.zone.status) : { completeStatus: '', normalPercentage: ''}

    return (
      <div className="side-content">
        <div className="top">
          <span className="back"><Link to={`${this.props.isSubzone ? `/zones/${this.props.zone._id}` : '/'}`}>Regresar</Link></span>
          { this.props.isWindow === 'zones' ? null : <Link to="/"><span className="pop-window">Hacer ventana</span></Link> }
        </div>
        <StatusOverall
          status={completeStatus}
          zone={this.props.zone || this.props.subzone}
          type={this.props.isZone ? 'zone' : 'subzone'}
        />
        <div>
          <div>
            Sensores
            Cámaras
          </div>
          {
            this.props.isZone
            ? <ZonesContainer
                zone={this.props.zone}
                zones={this.props.zone.subzones}
                changeSitesView={this.changeSitesView}
                viewStyle={this.state.viewStyle}
                onHover={this.onHover}
                isZone
              />
            : <ZonesContainer
                subzone={this.props.subzone}
                sites={this.props.subzone.sites}
                changeSitesView={this.changeSitesView}
                viewStyle={this.state.viewStyle}
                onHover={this.onHover}
                isSubzone
              />
          }
        </div>
      </div>
    )
  }
}

export default ZoneDetail
