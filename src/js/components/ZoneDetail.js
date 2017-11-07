import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { StatusOverall, ZonesContainer } from './'
import { getStatus, substractReportValues } from '../SpecialFunctions'

class ZoneDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewSort: 'STATIC',
      viewStyle: 'list',
      currentView: 'sensors',
      selectedZone: null,
      reports: [],
      status: null,
      percentage: null
    }

    this.changeSitesView = this.changeSitesView.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onViewChange = this.onViewChange.bind(this)
    this.onViewSortChange = this.onViewSortChange.bind(this)
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

  onViewSortChange(style) {
    this.setState({
      viewSort: style || 'STATIC'
    })
  }

  onViewChange(view) {
    this.setState({
      currentView: view || 'sensors'
    })
  }

  getBackLink({type, zone, subzone}) {
    switch (type) {
      case 'zone': return '/'
      case 'subzone': return `/zones/${zone._id}`
      case 'site': return `/zones/${zone._id}/${subzone && subzone._id}`
      default: return '/'
    }
  }

  getBackType({type}) {
    switch (type) {
      case 'zone': return 'General'
      case 'subzone': return 'Zonas'
      case 'site': return 'Subzonas'
      default: return ''
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

  componentWillReceiveProps(nextProps) {
    const reports = substractReportValues(nextProps.reports)
    const { status, percentage } = getStatus(reports || null)

    this.setState({
      reports,
      status,
      percentage
    })
  }

  // TODO: Optimize and make correct comparisons
  // shouldComponentUpdate(nextProps, nextState) {
  //   const { _id: currentId } = this.props.site || this.props.subzone || this.props.zone
  //   const { _id: nextId } = nextProps.site || nextProps.subzone || nextProps.zone
  //
  //   if (currentId !== nextId) return true
  //   if (this.state.percentage !== nextState.percentage) return true
  //   if (this.props.type !== nextProps.type) return true
  //   if (this.state.viewStyle !== nextState.viewStyle) return true
  //   if (this.state.currentView !== nextState.currentView) return true
  //   if (this.state.viewSort !== nextState.viewSort) return true
  //   if (this.state.reports && this.state.reports.sensors && (JSON.stringify(Object.values(this.state.reports.sensors)) !== JSON.stringify(Object.values(nextState.reports.sensors)))) return true
  //   if (this.getElements(this.props.type, nextProps).length != this.getElements(nextProps.type, nextProps).length) return true
  //   return false
  // }

  getElements(type, props) {
    switch (type) {
      case 'general': return props.zone || []
      case 'zone': return (props.zone && props.zone.subzones) || []
      case 'subzone': return (props.subzone && props.subzone.sites) || []
      case 'site': return (props.site && props.site.sensors) || []
      default: return []
    }
  }

  render() {
    const data = substractReportValues(this.props.reports)
    const elements = this.getElements(this.props.type, this.props)

    const { status, percentage } = this.state

    return (
      <div className="side-content">
        {
          this.state.currentView !== 'cameras'
          &&
          <div className="top">
            {
              this.props.type !== 'general'
              && <span className="back">
                  <Link to={this.getBackLink(this.props)}>
                    Regresar
                    <span>{this.getBackType(this.props)}</span>
                  </Link>
                </span>
            }
            {
              this.props.isWindow !== 'zones'
              && <span className="pop-window" onClick={this.props.onPopWindow}>Hacer ventana</span>
            }
          </div>
        }
        {
          this.state.currentView !== 'cameras'
          &&
          <StatusOverall
            status={status}
            percentage={percentage}
            alarms={data.alarms}
            zone={this.props.subzone || this.props.zone}
            site={this.props.site}
            type={this.props.type}
            hasElements={elements && elements.length > 0}
          />
        }
          {/* {
            this.isSite
            && <div>
                Sensores
                Cámaras
              </div>
          } */}
          {
            elements && elements.length === 0 && this.props.type !== 'site'
            ? <div className="no-content">
                <div className="kawlant-logo"></div>
                <span>Sin elementos</span>
              </div>
            : <ZonesContainer
                changeSitesView={this.changeSitesView}
                viewStyle={this.state.viewStyle}
                currentView={this.state.currentView}
                onViewChange={this.onViewChange}
                onViewSortChange={this.onViewSortChange}
                onHover={this.onHover}
                highlightedZone={this.state.selectedZone}
                type={this.props.type}
                reports={this.props.reports}
                zone={this.props.zone}
                subzone={this.props.subzone}
                site={this.props.site}
                sensors={data.sensors}
                viewSort={this.state.viewSort}
                elements={elements}
              />
          }
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
  isWindow: PropTypes.string,
  onPopWindow: PropTypes.func,
  onHover: PropTypes.func,
  reports: PropTypes.array
}

export default ZoneDetail
