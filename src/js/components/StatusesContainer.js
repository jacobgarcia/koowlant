import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { substractReportValues, getStatus, getFilteredReports } from '../lib/specialFunctions'
import { ElementStatus } from './'

class StatusesContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      show: 'SENSORS'
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

  getContent() {
    const { props, state } = this

    switch (state.show) {
      case 'SENSORS':
      return (
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
      )
      case 'CAMERAS':
      return (
        <h1>Cameras</h1>
      )
      case 'INFO':
      return (
        props.element &&
        <div className="info readonly">
          <div>
            <label htmlFor="">Id</label>
            <input type="text" value={props.element._id} readOnly />
          </div>
          <div>
            <label htmlFor="">Nombre</label>
            <input type="text" value={props.element.name} />
          </div>
          <div>
            <label htmlFor="">KEY</label>
            <input type="text" value={props.element.key} />
          </div>
          <div>
            <label htmlFor="">Ubicación</label>
            <input type="text" value={props.element.address} />
          </div>
          <div>
            <h4>Coordenadas</h4>
            <label htmlFor="">Latitud</label>
            <input type="text" value={props.element.position[0]} />
            <label htmlFor="">Longitud</label>
            <input type="text" value={props.element.position[1]} />
          </div>
          <div>
            <h4>Usuarios monitoreando</h4>
          </div>
          <div>
            <label>Notas</label>
            <textarea>{props.element.notes}</textarea>
          </div>
        </div>
      )
      default: return null
    }
  }

  render() {
    const { state } = this
    return (
      <div className="statuses-container">
        <ul className="statuses-container-nav">
          <li onClick={() => this.setState({show: 'SENSORS'})} className={state.show === 'SENSORS' ? 'active' : ''}>Sensores</li>
          <li onClick={() => this.setState({show: 'CAMERAS'})} className={state.show === 'CAMERAS' ? 'active' : ''}>Cámaras</li>
          <li onClick={() => this.setState({show: 'INFO'})} className={state.show === 'INFO' ? 'active' : ''}>Información</li>
        </ul>
        <div className="content">
          {
            this.getContent()
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
