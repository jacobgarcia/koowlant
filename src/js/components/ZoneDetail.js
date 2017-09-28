import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { StatusOverall, ZonesContainer } from './'
import { getStatus, getData, getFilteredReports } from '../SpecialFunctions'

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

  onHover(elementId) {
    this.props.onHover(elementId)

    this.setState({
      selectedZone: elementId
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

  getCorrectData({type, site, subzone, zone }) {
    switch (type) {
      case 'general': return zone
      case 'zone': return zone
      case 'subzone': return subzone
      case 'site': return site
      default: return null
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps filtered reports', getFilteredReports(this.nextProps.reports, this.getCorrectData(this.props)))
  // }

  render() {
    console.log('Reports', this.props.reports)
    // console.log('Correct data', this.getCorrectData(this.props))
    let data = getFilteredReports(this.props.reports, this.getCorrectData(this.props))
    console.log(this.getCorrectData(this.props))
    console.log('dat', data)
    data = data.reduce((sum, {alarms = [], sensors = []}) => {
      return ({
        alarms: [...sum.alarms, ...(alarms[0].values || [])],
        sensors: [...sum.sensors, ...(sensors[0].values || [])],
      })
    }, { alarms: [], sensors: []})
    console.log('data', data)
    const { status, percentage } = getStatus(data)
    console.log('status', status)
    console.log('percentage', percentage)


    return (
      <div className="side-content">
        <div className="top">
          { (this.props.type !== 'general') && <span className="back"><Link to={this.getBackLink(this.props)}>Regresar</Link></span> }
          { this.props.isWindow !== 'zones' && <span className="pop-window" onClick={this.props.onPopWindow}>Hacer ventana</span> }
        </div>
        <StatusOverall
          status={status}
          percentage={percentage}
          alarms={data.alarms && data.alarms}
          zone={this.props.subzone || this.props.zone}
          site={this.props.site}
          type={this.props.type}
        />
        <div>
          {
            this.isSite
            && <div>
                Sensores
                Cámaras
              </div>
          }
          <ZonesContainer
            {...this.props}
            changeSitesView={this.changeSitesView}
            viewStyle={this.state.viewStyle}
            onHover={this.onHover}
            highlightedZone={this.state.selectedZone}
            type={this.props.type}
            reports={this.props.reports}
          />
        </div>
      </div>
    )
  }
}

ZoneDetail.propTypes = {
  site: PropTypes.object,
  subzone: PropTypes.object,
  zone: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  type: PropTypes.string,
  isWindow: PropTypes.bool,
  onPopWindow: PropTypes.func,
  onHover: PropTypes.func
}

export default ZoneDetail
