import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { substractReportValues, getStatus, getFilteredReports } from '../lib/specialFunctions'
import { ElementStatus } from './'


// IMPORTANT TODO if we change the site key, re-set the socket or ask to join there
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

    const isSensor = props.type !== 'SITE' ? 'SENSORS' : null

    switch (isSensor || state.show) {
      case 'SENSORS':
      return (
        (props.elements && props.elements.length > 0)
        ?
        props.elements.map(element => {
          let reports = getFilteredReports(props.reports, element)
          reports = substractReportValues(reports)
          let { status, percentage } = getStatus(reports || null)

          if (props.type === 'SITE') {
            const sensor = substractReportValues(props.reports).sensors.find(({key}) => key === element.key)
            status = [{ name: 'normal', value: sensor.value}, { name: 'alerts', value: 100 - sensor.value }]
            percentage = sensor.value
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
                nonPercentage={props.type === 'SITE'}
              />
            </Link>
          )
        })
        :
        <div>
          Sin información
        </div>
      )
      case 'CAMERAS':
      return (
        <div>
          Sin información de video
        </div>
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
            <input type="text" value={props.element.position ? props.element.position[0] : ''} />
            <label htmlFor="">Longitud</label>
            <input type="text" value={props.element.position ? props.element.position[1] : ''} />
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
    const { state, props } = this
    return (
      <div className="statuses-container">
        {
          props.type === 'SITE'
          &&
          <ul className="statuses-container-nav">
            <li onClick={() => this.setState({show: 'SENSORS'})} className={state.show === 'SENSORS' ? 'active' : ''}>Sensores</li>
            <li onClick={() => this.setState({show: 'CAMERAS'})} className={state.show === 'CAMERAS' ? 'active' : ''}>Cámaras</li>
            <li onClick={() => this.setState({show: 'INFO'})} className={state.show === 'INFO' ? 'active' : ''}>Información</li>
          </ul>
        }
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
