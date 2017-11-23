import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { MiniZone } from './'
import { getFilteredReports, substractReportValues, getStatus } from '../lib/specialFunctions'

function getMiniZoneLink(zone, props) {
  switch (props.type) {
    case 'general': return `/zones/${zone._id}`
    case 'zone': return `/zones/${props.zone._id}/${zone._id}`
    case 'subzone': return `/zones/${props.zone._id}/${props.subzone._id}/${zone._id}`
    case 'site': return 'Torre ' + name
    default: return `/`
  }
}

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
  }

  componentWillReceiveProps(nextProps) {
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

  render() {
    const props = this.props

    return (
      <div className={`search-container ${this.props.isVisible ? '' : 'hidden'}`}>
        <div className="search">
          <div className="header">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.query}
              name="query"
              placeholder="Buscar"
            />
            <span className="button" onClick={this.props.onClose}>Cerrar</span>
          </div>
          <div className="results">
            {
              this.state.filteredSites.length > 0
              &&
              <div className="sites-container">
                <p>Sitios</p>
                {
                  this.state.filteredSites.map((element, index) => {
                    let reports = getFilteredReports(this.props.reports, element)
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link
                        key={index}
                        to={`/zones/${element.zone}/${element.subzone}/${element._id}`}
                        onClick={this.props.onClose}
                        >
                        {/* <MiniZone
                          onHover={props.onHover}
                          type={'subzone'}
                          id={element._id}
                          name={element.name}
                          zone={element}
                          active={props.highlightedZone === element._id}
                          reports={reports}
                          status={status}
                          percentage={percentage}
                        /> */}
                      </Link>
                    )
                  })
                }
              </div>
            }
            {
              this.state.filteredSubzones.length > 0
              &&
              <div className="subzones-container">
                <p>Subzonas</p>
                {
                  this.state.filteredSubzones.map((element, index) => {
                    let reports = getFilteredReports(this.props.reports, element)
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link
                        to={`/zones/${element.zone}/${element._id}`}
                        key={index}
                        onClick={this.props.onClose}
                        >
                        {/* <MiniZone
                          onHover={props.onHover}
                          type={'zone'}
                          id={element._id}
                          name={element.name}
                          zone={element}
                          active={props.highlightedZone === element._id}
                          reports={reports}
                          status={status}
                          percentage={percentage}
                        /> */}
                      </Link>
                    )
                  })
                }
              </div>
            }
            {
              this.state.filteredZones.length > 0
              &&
              <div className="zones-container">
                <p>Zonas</p>
                {
                  this.state.filteredZones.map((element, index) => {
                    let reports = getFilteredReports(this.props.reports, element)
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)
                    return (
                      <Link
                        to={`/zones/${element._id}`}
                        key={index}
                        onClick={this.props.onClose}
                        >
                        {/* <span>{JSON.stringify(element)}</span> */}
                        <MiniZone
                          onHover={props.onHover}
                          type={'general'}
                          id={element._id}
                          name={element.name}
                          zone={element}
                          active={props.highlightedZone === element._id}
                          reports={reports}
                          status={status}
                          percentage={percentage}
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
          </div>
          </div>
      </div>
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
