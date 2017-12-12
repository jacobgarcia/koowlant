/* eslint max-statements: ["error", 15] */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, Polygon as LeafletPolygon, Circle } from 'react-leaflet'
import { connect } from 'react-redux'

import { Overall, Alerts, Polygon, Marker, Search, CreateElementBar } from '../components'
import { NetworkOperation } from '../lib'
import { setLoading, setComplete, setReport, setSubzone, setZone, setSite, resetReports } from '../actions'
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
      elementHover: null,

      // For area creation
      hoverPosition: [],

      // New element
      newPositions: [],
      newElementName: '',
      isNewElementValid: false
    }

    this.getElementsToRender = this.getElementsToRender.bind(this)
    this.onElementOver = this.onElementOver.bind(this)
    this.toggleVisible = this.toggleVisible.bind(this)
    this.onToggleSearch = this.onToggleSearch.bind(this)
    this.toggleCreate = this.toggleCreate.bind(this)

    // MAP
    this.onMapClick = this.onMapClick.bind(this)
    this.onElementNameChange = this.onElementNameChange.bind(this)
    this.onElementPositionsChange = this.onElementPositionsChange.bind(this)
    this.onCreateElement = this.onCreateElement.bind(this)
  }

  componentWillMount() {
    NetworkOperation.getAvailableStates()
    .then(({data}) => {
      this.setState({
        states: data.states
      })
    })

    this.props.resetReports()
    NetworkOperation.getReports()
    .then(({data}) => {
      data.reports.forEach(report => {
        this.props.setReport(report)
      })
    })
  }

  componentDidMount() {
    const { elements = [] } = this.getElementsToRender(this.props)
    this.setState({
      elements
    })
  }

  componentWillReceiveProps(nextProps) {
    const { zoneId = null, subzoneId = null, siteId = null } = nextProps.match.params
    if (this.props.match.params === nextProps.match.params) return

    if (nextProps.zones.length === 0) return

    // If we have the same paramters dont update the state
    if (zoneId === null && subzoneId === null && siteId === null) {
      const { elements = [], shadow = null } = this.getElementsToRender(nextProps)
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
      const { elements = [], element = null, shadow = null } = this.getElementsToRender(nextProps)

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

  getElementsToRender(props) {
    const { zoneId = null, subzoneId = null, siteId = null } = props.match.params

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

  onElementNameChange(event) {
    const { value } = event.target

    this.setState({
      newElementName: value,
      isNewElementValid: this.state.newPositions.length > 0 && value.length > 0
    })
  }

  onElementPositionsChange(event) {
    let value = event.target.value
    const name = event.target.name
    // Remove all non-numbers and no '-' or '.'
    if (value.length > 0) value = value.match(/[-\d.]/g).join('')

    // Update the last position, since this is the one we're usingto display
    const positions = (this.state.newPositions.length > 0) ? this.state.newPositions : [[]]

    name === 'lat'
    ? positions[positions.length - 1][0] ? positions[positions.length - 1][0] = value : positions[positions.length - 1] = [value, 0]
    : positions[positions.length - 1][1] ? positions[positions.length - 1][1] = value : positions[positions.length - 1] = [0, value]

    this.setState({
      newPositions: positions,
      isNewElementValid: this.state.newElementName.length > 0 && positions.length > 0
    })
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

  onMapClick(event) {
    if (!this.state.isCreating) return

    const { lat, lng } = event.latlng
    const newPosition = [lat,lng]

    this.setState(prev => ({
      newPositions: prev.newPositions.concat([newPosition])
    }))
  }

  onCreateElement() {
    const { zoneId: selectedZone = null, subzoneId: selectedSubzone = null } = this.props.match.params
    const { newPositions, newElementName } = this.state

    if (selectedSubzone) {
      NetworkOperation.setSite(selectedZone, selectedSubzone, newElementName, Date.now(), newPositions[newPositions.length - 1])
      .then(({data}) => {
        this.setState({ newPositions: [], newElementName: '', isCreating: null, showing: null })
        this.props.setSite(data.site.zone ,data.site.subzone, data.site._id, data.site.key, data.site.name, data.site.position)
      }).catch(console.log)
    } else if (selectedZone) {
      NetworkOperation.setSubzone(selectedZone, newElementName, newPositions)
      .then(({data}) => {
        this.setState({ newPositions: [], newElementName: '', isCreating: null, showing: null })
        this.props.setSubzone(data.subzone.parentZone, data.subzone._id, data.subzone.name, data.subzone.positions)
      }).catch(console.log)
    } else {
      NetworkOperation.setZone(newElementName, newPositions)
      .then(({data}) => {
        this.setState({ newPositions: [], newElementName: '', isCreating: null, showing: null })
        this.props.setZone(data.zone._id, data.zone.name, data.zone.positions)
      }).catch(console.log)
    }
  }

  render() {
    const { state, props } = this
    const { zoneId: selectedZone = null, subzoneId: selectedSubzone = null, siteId: selectedSite = null } = props.match.params
    // const reports =

    return (
      <div id="map-container" className={state.isCreating ? 'creating-element' : ''}>
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
          isCreating={state.isCreating}
        />
        {
          state.isSearching
          &&
          <Search
            isVisible={state.isSearching}
            zones={props.zones}
            onClose={this.onToggleSearch}
            reports={props.reports}
          />
        }
        <Map
          center={state.currentPosition}
          ref={map => {
            this.map = map
          }}
          zoom={state.currentZoom}
          onClick={this.onMapClick}
          onMouseMove={({latlng}) => state.isCreating && this.setState({ hoverPosition: [latlng.lat, latlng.lng] })}
          animate
        >
          <div className="bar-actions" onMouseMove={() => state.isCreating && this.setState({hoverPosition: null})}>
            <div>
              {
                (selectedZone && state.showing !== 'OVERALL' && !state.isCreating)
                &&
                <span className="button back" onClick={() => {
                    if (state.isCreating) this.toggleCreate()
                    if (selectedSite) props.history.push(`/zones/${selectedZone}/${selectedSubzone}`)
                    else if (selectedSubzone) props.history.push(`/zones/${selectedZone}`)
                    else if (selectedZone) props.history.push('/')
                }}>Regresar <span>{selectedSubzone ? (selectedSite ? 'subzona' : 'zona') : 'general'}</span></span>
              }
            </div>
            {
              <ul className={`links hiddable ${state.isCreating && 'hidden'}`}>
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
          {
            state.isCreating
            &&
            (selectedSubzone
            ?
            <Marker
              position={state.newPositions && state.newPositions[0] ? state.newPositions[state.newPositions.length - 1] : [0,0]}
              site={{name: state.newElementName}}
              title={state.newElementName}
            />
            :
            <LeafletPolygon
              weight={1}
              positions={state.hoverPosition ? [...state.newPositions, state.hoverPosition] : state.newPositions}
            />)
          }
          {
            state.isCreating && !selectedSubzone
            &&
            state.newPositions.map((position, index) =>
              <Circle
                key={index}
                radius={5}
                center={position}
              />
            )
          }
          <TileLayer
            url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${props.darkMode ? 'dark' : 'light'}_all/{z}/{x}/{y}${window.devicePixelRatio > 1 ? '@2' : ''}.png`}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          />
        </Map>
        <CreateElementBar
          onCreate={this.onCreateElement}
          onMouseOver={() => this.setState({hoverPosition: null})}
          className={state.isCreating ? '' : 'hidden'}
          isNewElementValid={state.isNewElementValid}
          isCreatingSite={Boolean(selectedSubzone)}
          isCreatingSubzone={Boolean(selectedZone)}
          onNameChange={this.onElementNameChange}
          onPositionsChange={this.onElementPositionsChange}
          positions={state.newPositions}
        />
        <Alerts
          alarms={props.reports.filter(({alarms}) => alarms.length > 0)}
          isVisible={state.showing === 'ALERTS'}
          onVisibleToggle={() => this.toggleVisible('ALERTS')}
          isCreating={state.isCreating}
        />
      </div>
    )
  }
}

MapContainer.propTypes = {
  history: PropTypes.object,
  zones: PropTypes.array,
  match: PropTypes.object,
  reports: PropTypes.array,
  setReport: PropTypes.func
}

function mapStateToProps({zones, reports, darkMode}) {
  return {
    zones,
    reports,
    darkMode
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setZone: (id, name, positions) =>
      dispatch(setZone(id, name, positions)),
    setSubzone: (zoneId, subzoneId, name, positions) =>
      dispatch(setSubzone(zoneId, subzoneId, name, positions)),
    setSite: (zoneId, subzoneId, siteId, key, name, position) =>
      dispatch(setSite(zoneId, subzoneId, siteId, key, name, position)),
    setLoading: () => dispatch(setLoading()),
    setComplete: () => dispatch(setComplete()),
    setReport: report => dispatch(setReport(report)),
    resetReports: () => dispatch(resetReports())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
