import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ElementStatus, Prompt } from './'
import { getFilteredReports, substractReportValues, getStatus } from '../lib/specialFunctions'

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      sites: [],
      subzones: [],
      zones: [],
      filteredSubzones: [],
      filteredSites: [],
      filteredZones: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.getLink = this.getLink.bind(this)
    this.setElements = this.setElements.bind(this)
  }

  componentDidMount() {
    this.setElements(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setElements(nextProps)
  }

  setElements(nextProps) {
    if (JSON.stringify(nextProps.zones) === JSON.stringify(this.props.zones.length)) return

    const zones = nextProps.zones.map(({_id: zoneId, name, subzones}) =>
      ({
        _id: zoneId,
        name,
        subzones: subzones.map(({_id: subzoneId, name, sites}) =>
          ({
            _id: subzoneId,
            name,
            zone: zoneId,
            sites: sites.map(({_id, name, key}) =>
            ({
              _id,
              name,
              key,
              zone: zoneId,
              subzone: subzoneId
            })
            )
          })
        )
      })
    )

    const subzones = zones.reduce((subzones, zone) =>
      [
        ...zone.subzones,
        ...subzones
      ],
    [])

    const sites = subzones.reduce((sites, subzone) =>
      ([
        ...subzone.sites,
        ...sites
      ])
    , [])

    this.setState({
      sites,
      subzones,
      zones,
    })
  }

  handleChange(event) {
    const { name, value } = event.target

    if (value === '') {
      this.setState({
        [name]: value,
        filteredSubzones: [],
        filteredSites: [],
        filteredZones: []
      })
      return
    }

    const filteredSubzones = this.state.subzones.filter(subzone =>
      JSON.stringify(subzone).toLowerCase()
      .includes(value.toLowerCase())
    )

    const filteredSites = this.state.sites.filter(site =>
      JSON.stringify(site).toLowerCase()
      .includes(value.toLowerCase())
    )

    const filteredZones = this.state.zones.filter(zone =>
      JSON.stringify(zone).toLowerCase()
      .includes(value.toLowerCase())
    )

    this.setState({
      [name]: value,
      filteredSubzones,
      filteredSites,
      filteredZones
    })
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

  getLink(type, element) {
    switch (type) {
      case 'GENERAL': return `/zones/${element._id}`
      case 'ZONE': return `/zones/${element.zone}/${element._id}`
      case 'SUBZONE': return `/zones/${element.zone}/${element.subzone}/${element._id}`
      default: return `/`
    }
  }

  render() {
    const { state, props } = this

    return (
      <Prompt className={props.isVisible ? 'search-container' : 'hidden'} onDismiss={props.onClose}>
        <div className="search" onClick={evt => evt.stopPropagation()}>
          <div className="header">
            <input
              type="text"
              onChange={this.handleChange}
              value={state.query}
              name="query"
              placeholder="Buscar..."
              autoComplete="off"
              autoCorrect="off"
            />
            <button onClick={this.props.onClose}>Cancelar</button>
          </div>
          <div className="results">
            {
              (state.filteredSites.length > 0)
              &&
              <div className="sites-container">
                <p>Sitios</p>
                {
                  state.filteredSites.map(element => {
                    let reports = getFilteredReports(this.props.reports, {...element, type: 'SITE'})
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link key={element._id} to={this.getLink('SUBZONE', element)}>
                        <ElementStatus
                          id={element._id}
                          title={this.getElementTitle('SUBZONE')}
                          name={element.name}
                          type={'SUBZONE'}
                          siteKey={element.key}
                          percentage={percentage} // Zone
                          status={status} // Zone
                          alarms={reports ? reports.alarms.length : 0}
                          elements={element.elements} // Subzones or sites
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
            {
              (this.state.filteredSubzones.length > 0)
              &&
              <div className="subzones-container">
                <p>Subzonas</p>
                {
                  this.state.filteredSubzones.map(element => {
                    let reports = getFilteredReports(this.props.reports, {...element, type: 'SUBZONE'})
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link key={element._id} to={this.getLink('ZONE', element)}>
                        <ElementStatus
                          id={element._id}
                          title={this.getElementTitle('ZONE')}
                          name={element.name}
                          type={'ZONE'}
                          siteKey={element.key}
                          percentage={percentage} // Zone
                          status={status} // Zone
                          alarms={reports ? reports.alarms.length : 0}
                          elements={element.elements} // Subzones or sites
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
            {
              (this.state.filteredZones.length > 0)
              &&
              <div className="zones-container">
                <p>Zonas</p>
                {
                  this.state.filteredZones.map(element => {
                    let reports = getFilteredReports(this.props.reports, {...element, type: 'ZONE'})
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link key={element._id} to={this.getLink('GENERAL', element)}>
                        <ElementStatus
                          id={element._id}
                          title={this.getElementTitle('GENERAL')}
                          name={element.name}
                          type={'GENERAL'}
                          siteKey={element.key}
                          percentage={percentage} // Zone
                          status={status} // Zone
                          alarms={reports ? reports.alarms.length : 0}
                          elements={element.elements} // Subzones or sites
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
          </div>
          </div>
      </Prompt>
    )
  }
}

Search.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  zones: PropTypes.array,
  onClose: PropTypes.func,
  reports: PropTypes.array
}

export default Search
