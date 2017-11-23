import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { substractReportValues, getStatus, getFilteredReports } from '../lib/specialFunctions'
import { ElementStatus } from './'

class StatusesContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.getLink = this.getLink.bind(this)
  }

  getLink(type, element) {
    const { zoneId, subzoneId, siteId } = this.props.params
    switch (type) {
      case 'GENERAL': return `/zones/${element._id}`
      case 'ZONE': return `/zones/${zoneId}/${element._id}`
      case 'SUBZONE': return `/zones/${zoneId}/${subzoneId}/${element._id}`
      case 'SITE': return `/zones/${zoneId}/${subzoneId}/${siteId}`
      default: return `/`
    }
  }

  getElementTitle(type) {
    switch (type) {
      case 'GENERAL': return 'Zona'
      case 'ZONE': return 'Subzona'
      case 'SUBZONE': return 'Sitio'
      case 'SITE': return 'Sensor'
      default: return `Otro`
    }
  }

  render() {
    const { props, state } = this
    return (
      <div className="statuses-container">
        <div className="statuses-container-nav">
        </div>
        <div className="content">
          {
            props.elements &&
            props.elements.map(element => {
              let reports = getFilteredReports(props.reports, element)
              reports = substractReportValues(reports)
              let { status, percentage } = getStatus(reports || null)
              if (props.type === 'SITE') {
                status = [{ name: 'normal', value: element.value}, { name: 'alerts', value: 100 - element.value }]
                percentage = element.value
              }

              // const { value = null } = element // Sensors

              return (
                <Link key={element._id} to={this.getLink(props.type, element)}>
                  <ElementStatus
                    id={element._id}
                    title={this.getElementTitle(props.type)}
                    name={element.name}
                    type={props.type}
                    siteKey={element.key}
                    percentage={percentage} // Zone
                    status={status} // Zone
                    alarms={reports ? reports.alarms.length : 0}
                    elements={element.elements} // Subzones or sites
                    onHover={props.onHover}
                  />
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}

StatusesContainer.propTypes = {
  params: PropTypes.object
}

export default StatusesContainer
