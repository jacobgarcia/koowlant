import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { MiniZone } from './'
import { getFilteredReports } from '../SpecialFunctions'

class Search extends Component {
  constructor(props) {
    super(props)

    const subzones = this.props.zones.reduce((subzones, zone) =>
      ([
        ...zone.subzones,
        ...subzones
      ]),
    [])
    const sites = subzones.reduce((sites, subzone) =>
      ([
        ...subzone.sites,
        ...sites
      ])
    , [])

    const zones = this.props.zones

    this.state = {
      query: '',
      sites,
      subzones,
      zones,
      filteredSubzones: [],
      filteredSites: [],
      filteredZones: []
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target

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
                  this.state.filteredSites.map(sites =>
                    <Link
                      to="/"
                      key={sites._id}>
                      <MiniZone
                        onHover={() => {}}
                        type="subzone"
                        id={sites._id}
                        name={sites.name}
                        zone={sites}
                        reports={getFilteredReports(this.props.reports, sites)}
                      />
                    </Link>
                  )
                }
              </div>
            }
            {
              this.state.filteredSubzones.length > 0
              &&
              <div className="subzones-container">
                <p>Subzonas</p>
                {
                  this.state.filteredSubzones.map(subzone =>
                    <Link
                      to="/"
                      key={subzone._id}>
                      <MiniZone
                        onHover={() => {}}
                        type="zone"
                        id={subzone._id}
                        name={subzone.name}
                        zone={subzone}
                        reports={getFilteredReports(this.props.reports, subzone)}
                      />
                    </Link>
                  )
                }
              </div>
            }
            {
              this.state.filteredZones.length > 0
              &&
              <div className="zones-container">
                <p>Zonas</p>
                {
                  this.state.filteredZones.map(zone =>
                    <Link
                      to="/"
                      key={zone._id}>
                      <MiniZone
                        onHover={() => {}}
                        type="general"
                        id={zone._id}
                        name={zone.name}
                        zone={zone}
                        reports={getFilteredReports(this.props.reports, zone)}
                      />
                    </Link>
                  )
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
