/*eslint max-statements: ["error", 15]*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, Polygon as LeafletPolygon } from 'react-leaflet'
import { connect } from 'react-redux'

import { Overall, Alerts, Polygon, Marker, Search } from '../components'
import { NetworkOperation } from '../lib'
import { setLoading, setComplete, setReport } from '../actions'
import { getAreaCenter } from '../lib/specialFunctions'

class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPosition: [23.2096057, -101.6139503],
      currentZoom: 5,
      shadow: null,
      element: null,
      elements: [],
      hoverElement: null,
      isCreating: null,
      showing: null,
      states: [],
      isSearching: false,
      elementHover: null
    }

    this.getElementsToRender = this.getElementsToRender.bind(this)
    this.onElementOver = this.onElementOver.bind(this)
    this.toggleVisible = this.toggleVisible.bind(this)
    this.onToggleSearch = this.onToggleSearch.bind(this)
    this.toggleCreate = this.toggleCreate.bind(this)
  }

  componentWillMount() {
    NetworkOperation.getAvailableStates()
    .then(({data}) => {
      this.setState({
        states: data.states
      })
    })

    NetworkOperation.getReports()
    .then(({data}) => {
      data.reports.forEach(report => {
        this.props.setReport(report)
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { zoneId = null, subzoneId = null, siteId = null } = nextProps.match.params

    if (nextProps.zones.length === 0) return

    // If we have the same paramters dont update the state
    if (zoneId === null && subzoneId === null && siteId === null) {
      const { elements = null, shadow = null } = this.getElementsToRender(nextProps)
      this.setState({
        elements,
        shadow,
        currentZoom: 5
      })
      return
    }

    this.setState({
      elements: [], // !important
      currentPosition: null // !important
    }, () => {
      // Get elements to render and the shadow polygon
      const { elements = null, element = null, shadow = null } = this.getElementsToRender(nextProps)

      // Update state
      this.setState(prev => ({
        currentPosition: siteId ? element.position : shadow ? getAreaCenter(shadow) : prev.currentPosition,
        currentZoom: siteId ? 13 : subzoneId ? 8 : zoneId ? 7 : 5,
        element,
        shadow,
        elements
      }))
    })
  }

  toggleCreate() {
    const { zoneId = null, subzoneId = null } = this.props.match.params

    this.setState(prev => ({
      newPositions: [],
      isCreating: prev.isCreating ? null : subzoneId ? 'SITE' : zoneId ? 'SUBZONE' : 'ZONE',
      showing: null
    }))
  }

  getElementsToRender(nextProps) {
    const { zoneId = null, subzoneId = null, siteId = null } = nextProps.match.params

    if (this.props.zones.length === 0) return { elements: [], shadow: null }

    if (siteId) {
      const { subzones = [] } = this.props.zones.find(({_id}) => _id === zoneId)
      const { sites = [], positions } = subzones.find(({_id}) => _id === subzoneId)
      const element = sites.find(({_id}) => _id === siteId)

      return {
        elements: sites,
        shadow: positions,
        element
      }
    } else if (subzoneId) {
      const { subzones = [] } = this.props.zones.find(({_id}) => _id === zoneId)
      const subzone = subzones.find(({_id}) => _id === subzoneId)
      const { sites = [], positions: shadow } = subzone

      return {
        elements: sites.map(site => ({...site, type: 'SITE'})),
        shadow,
        element: { _id: subzone._id, name: subzone.name }
      }
    } else if (zoneId) {
      const zone = this.props.zones.find(({_id}) => _id === zoneId)
      const { subzones = [], positions } = zone
      return {
        elements: subzones.map(({name, positions, _id, sites}) => ({name, positions, _id, elements: sites.length, type: 'SUBZONE'})),
        shadow: positions,
        element: {_id: zone._id, name: zone.name}
      }
    }

    return {
      elements: this.props.zones.map(({name, positions, _id, subzones}) => ({name, positions, _id, elements: subzones.length, type: 'ZONE'})),
      shadow: null,
      element: null
    }
  }

  onToggleSearch() {
    this.setState(prev => ({
      isSearching: !prev.isSearching,
    }))
  }

  onElementOver(elementId) {
    this.setState({
      hoverElement: elementId
    })
  }

  toggleVisible(element) {
    this.setState(prev => ({
      showing: prev.showing === element ? null : element
    }))
  }

  getElementReports() {
    const { zoneId = null, subzoneId = null, siteId = null } = this.props.match.params

    if (siteId) {
      return this.props.reports.filter(({site}) => site._id === siteId)
    } else if (subzoneId) {
      return this.props.reports.filter(({subzone}) => subzone._id === subzoneId)
    } else if (zoneId) {
      return this.props.reports.filter(({zone}) => zone._id === zoneId)
    }
    return this.props.reports
  }

  render() {
    const { state, props } = this
    const { zoneId: selectedZone = null, subzoneId: selectedSubzone = null, siteId: selectedSite = null } = this.props.match.params
    // const reports =

    return (
      <div id="map-container">
        <Overall
          params={props.match.params}
          alerts={null}
          onHover={this.onElementOver}
          elements={state.elements}
          selectedType={selectedSite ? 'SITE' : selectedSubzone ? 'SUBZONE' : selectedZone ? 'ZONE' : 'GENERAL'}
          isVisible={state.showing === 'OVERALL'}
          onVisibleToggle={() => this.toggleVisible('OVERALL')}
          reports={this.getElementReports()}
          element={state.element}
        />
        <Map
          center={state.currentPosition}
          ref={map => {
            this.map = map
          }}
          zoom={state.currentZoom}
          animate
        >
          {

          }
          <div className="bar-actions">
            <div>
              {
                (selectedZone && state.showing !== 'OVERALL' && !state.isCreating)
                &&
                <span className="button back" onClick={() => {
                    if (this.state.isCreating) this.toggleCreate()
                    if (selectedSite) props.history.push(`/zones/${selectedZone}/${selectedSubzone}`)
                    else if (selectedSubzone) props.history.push(`/zones/${selectedZone}`)
                    else if (selectedZone) props.history.push('/')
                }}>Regresar <span>{selectedSubzone ? (selectedSite ? 'subzona' : 'zona') : 'general'}</span></span>
              }
            </div>
            {
              !state.isCreating
              &&
              <ul className="links hiddable">
                <li className="button search"
                  onClick={this.onToggleSearch}>
                  <span className="search">Buscar</span>
                </li>
                {
                  !selectedSite
                  &&
                  <li className="button create"
                    onClick={this.toggleCreate}>
                    <span className="create">{selectedZone ? (selectedSubzone ? 'Sitio' : 'Subzona') : 'Zona'}</span>
                  </li>
                }
              </ul>
            }
            <div>
              {
                state.isCreating
                &&
                <span className="button huge cancel destructive" onClick={this.toggleCreate}>Cancelar</span>
              }
            </div>
          </div>
          <Search
            isVisible={this.state.isSearching}
            zones={props.zones}
            onClose={this.onToggleSearch}
            reports={props.reports}
          />
          {
            state.shadow
            &&
            <LeafletPolygon
              positions={[
                [[-85,-180], [-85,180], [85,180], [85,-180]],
                [...(state.shadow || [])]
              ]}
              fillOpacity={0.3}
              color="#666"
              weight={0}
              onClick={() => {
                if (state.isCreating) return null
                if (selectedSite) return props.history.push(`/zones/${selectedZone}/${selectedSubzone}`)
                if (selectedSubzone) return props.history.push(`/zones/${selectedZone}`)
                if (selectedZone) return props.history.push(`/`)
                return null
              }}
            />
          }
          {
            (selectedSubzone && state.elements)
            ?
            state.elements.map(element =>
              <Marker
                key={element._id}
                position={element.position || []}
                site={element}
                title={element.name}
                reports={this.props.reports.filter(({site: reportSite}) =>
                  reportSite.key === element.key
                )}
                isHighlighted={this.state.hoverElement === element._id}
                onMouseHover={this.onElementOver}
                isSite={selectedSubzone !== null}
                sensors={selectedSite ? state.element : element }
                onClick={() => {
                  if (selectedSite === element._id) {
                    this.setState({
                      showing: 'OVERALL'
                    })
                  }
                  props.history.push(`/zones/${selectedZone}/${selectedSubzone}/${element._id}`)
                }}
              />
            )
            :
            state.elements.map(element =>
              <Polygon
                key={element._id}
                zone={element}
                reports={(() => {
                  let reports = []
                  if (selectedZone) {
                    reports = props.reports.filter(({subzone}) => subzone._id === element._id)
                  } else {
                    reports = props.reports.filter(({zone}) => zone._id === element._id)
                  }
                  return reports
                })()}
                highlighted={element._id === state.hoverElement}
                onMouseHover={this.onElementOver}
                onClick={() => {
                  if (state.isCreating !== null) return null
                  if (selectedZone === null) return props.history.push(`/zones/${element._id}`)
                  if (selectedSubzone === null) return props.history.push(`/zones/${selectedZone}/${element._id}`)
                  return null
                }}
              />
            )
          }
          <TileLayer
            url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}${window.devicePixelRatio > 1 ? '@2' : ''}.png`}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          />
        </Map>
        <Alerts
          alerts={props.reports.filter(({alarms}) => alarms.length > 0)}
          isVisible={state.showing === 'ALERTS'}
          onVisibleToggle={() => this.toggleVisible('ALERTS')}
        />
      </div>
    )
  }
}

MapContainer.propTypes = {
  history: PropTypes.object,
  zones: PropTypes.array,
  match: PropTypes.object,
  reports: PropTypes.array
}

function mapStateToProps({zones, reports}) {
  return {
    zones,
    reports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: () => {
      dispatch(setLoading())
    },
    setComplete: () => {
      dispatch(setComplete())
    },
    setReport: report => {
      dispatch(setReport(report))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
