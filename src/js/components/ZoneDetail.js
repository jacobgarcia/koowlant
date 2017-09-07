import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { StatusOverall, ZonesContainer } from './'
import { getStatus } from '../SpecialFunctions'

class ZoneDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewStyle: 'list',
      selectedZone: null
    }

    this.changeSitesView = this.changeSitesView.bind(this)
    this.onHover = this.onHover.bind(this)
  }

  changeSitesView(viewStyle) {
    this.setState({ viewStyle })
  }

  onHover(zoneId) {
    this.setState({
      selectedZone: zoneId
    })
  }

  getBackLink(props) {
    switch (props.type) {
      case 'zone': return '/'
      case 'subzone': return `/zones/${props.zone._id}`
      case 'site': return `/zones/${props.zone._id}/${props.subzone._id}`
      default: return '/'
    }
  }

  render() {
    // normalPercentage
    const { completeStatus } = this.props.zone ? getStatus(this.props.zone.status) : { completeStatus: '', normalPercentage: ''}

    return (
      <div className="side-content">
        <div className="top">
          <span className="back"><Link to={this.getBackLink(this.props)}>Regresar</Link></span>
          { this.props.isWindow === 'zones' ? null : <span className="pop-window" onClick={this.props.onPopWindow}>Hacer ventana</span> }
        </div>
        <StatusOverall
          status={completeStatus}
          zone={this.props.zone || this.props.subzone}
          site={this.props.site}
          type={this.props.type}
        />
        <div>
          {
            this.isSite
            ? <div>
                Sensores
                Cámaras
              </div>
            : null
          }
          <ZonesContainer
            {...this.props}
            changeSitesView={this.changeSitesView}
            viewStyle={this.state.viewStyle}
            onHover={this.onHover}
            highlightedZone={this.state.selectedZone}
            type={this.props.type}
          />
        </div>
      </div>
    )
  }
}

ZoneDetail.propTypes = {
  site: PropTypes.object,
  subzone: PropTypes.object,
  zone: PropTypes.object,
  type: PropTypes.string,
  isWindow: PropTypes.bool,
  onPopWindow: PropTypes.func
}

export default ZoneDetail
