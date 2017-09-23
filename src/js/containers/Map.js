/* eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import qs from 'query-string'
import { Map, TileLayer, Polygon } from 'react-leaflet'

import { setZone } from '../actions'
import { CreateZoneBar, ZoneDetail, Reports, ZonePolygon, SiteMarker } from '../components'
import { getAreaCenter } from '../SpecialFunctions'

class MapView extends Component {
  constructor(props) {
    super(props)
    this.isWindow = qs.parse(props.location.search).isWindow

    const {zoneId, subzoneId, siteId} = props.match.params

    const selectedZone = props.zones.filter(zone => zone._id === zoneId).pop()
    const selectedSubzone = selectedZone ? selectedZone.subzones.filter(subzone => subzone._id === subzoneId).pop() : null
    const selectedSite = (selectedZone && selectedSubzone) ? selectedSubzone.sites.filter(site => site._id === siteId).pop() : null

    this.state = {
      isCreatingZone: false,
      isGeneralStatusHidden: true,
      isAlertsHidden: true,
      currentZoom: 5, // TODO load from localStorage
      currentPosition: [23.2096057, -101.6139503], // TODO load from localStorage
      highlightedZone: null,
      zones: props.zones,
      selectedZone,
      selectedSubzone,
      selectedSite,
      newName: '',
      newPositions: [],
      sitesViewStyle: 'list', // TODO load from localStorage
      sitesViewOrdering: 'static', // TODO load from localStorage
      isCreatingSite: false,
    }

    this.hide = this.hide.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.saveNewZone = this.saveNewZone.bind(this)
    this.onChange = this.onChange.bind(this)
    this.isNewZoneValid = this.isNewZoneValid.bind(this)
    this.onSiteHover = this.onSiteHover.bind(this)
    this.popWindow = this.popWindow.bind(this)
    this.changeSitesView = this.changeSitesView.bind(this)
    this.onSelectElement = this.onSelectElement.bind(this)
    this.getType = this.getType.bind(this)
  }

  isNewZoneValid() {
    const newName = this.state.newName
    const newPositions = this.state.newPositions
    const isNewZoneValid = (newName.split('').length > 2 && newPositions.length > 2)

    this.setState({
      isNewZoneValid
    })
    return isNewZoneValid
  }

  hide(componentName) {
    this.setState(prevState => ({
      isGeneralStatusHidden: componentName === 'alerts' ? true : !prevState.isGeneralStatusHidden,
      isAlertsHidden: componentName === 'general-status' ? true : !prevState.isAlertsHidden,
    }))
  }

  saveNewZone() {
    if (!this.isNewZoneValid()) return

    const { newName, newPositions } = this.state.newName

    this.props.setZone(newName, newPositions)

    this.setState({
      newPositions: [],
      newName: '',
      isCreatingZone: false
    })
  }

  onChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    }, () => this.isNewZoneValid())
  }

  onSearch() {
    console.log('Searching...')
  }

  onCreate() {
    // If we are in a selected zone
    let state
    if (this.state.selectedZone && !this.state.isCreatingZone) {
      state = !this.state.isCreatingZone
      this.setState(prevState => ({
        promptElement: !state || !prevState.promptElement
      }))

      if (state) return
    }

    this.setState(prevState => ({
      newPositions: [],
      isCreatingZone: state || !prevState.isCreatingZone,
      isGeneralStatusHidden: true,
      isAlertsHidden: true
    }))
  }

  componentWillReceiveProps(nextProps) {
    const {zoneId, subzoneId, siteId} = nextProps.match.params

    const selectedZone = this.props.zones.filter(zone => zone._id === zoneId).pop()
    const selectedSubzone = selectedZone ? selectedZone.subzones.filter(subzone => subzone._id === subzoneId).pop() : null
    const selectedSite = (selectedZone && selectedSubzone) ? selectedSubzone.sites.filter(site => site._id === siteId).pop() : null

    if (!selectedZone) {
      this.setState({
        selectedZone: null,
        selectedSubzone: null,
        currentZoom: 5,
        currentPosition: [23.2096057, -101.6139503]
      })
      return
    }

    if ((this.state.selectedZone && zoneId !== this.state.selectedZone._id) || !subzoneId) {
      this.setState({
        selectedZone,
        currentZoom: 5.5,
        currentPosition: selectedZone.positions[0] ? getAreaCenter(selectedZone.positions[0]) : [23.2096057, -101.6139503],
        selectedSubzone: null,
        selectedSite: null
      })
      return
    }

    if (selectedSubzone && (!this.state.selectedSubzone || (this.state.selectedSubzone && subzoneId !== this.state.selectedSubzone._id))) {
      this.setState({
        selectedSubzone,
        selectedSite: null,
        currentZoom: 6.7
      }, () => {
        selectedSubzone.positions[0]
        && this.setState({currentPosition: getAreaCenter(selectedSubzone.positions[0])})
      })
      return
    }

    if (selectedSite && (!this.state.selectedSite || (this.state.selectedSite && subzoneId !== this.state.selectedSite._id))) {
      this.setState({
        selectedSite,
        currentZoom: 7.5
      }, () => this.setState({currentPosition: selectedSite.position}))
    }
  }

  onSiteHover(elementId) {
    this.setState({ highlightedZone: elementId })
  }

  onMapClick(event) {
    if (!this.state.isCreatingZone) return

    const { lat, lng } = event.latlng
    const newPosition = [lat,lng]

    // If we're creating a zone, replace the old position
    if (this.state.isCreatingSite) {
      this.setState({
        newPositions: [newPosition]
      })
      return
    }

    this.setState(prevState => ({
      newPositions: prevState.newPositions.concat([newPosition])
    }), () => {
      this.isNewZoneValid()
    })
  }

  popWindow(section) {
    window.open(
      `${window.host}?isWindow=${section}`, 'Telco', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=493'
    )
  }

  changeSitesView(style) {
    this.setState({ sitesViewStyle: style })
  }

  onSelectElement(elementType) {
    this.setState({
      promptElement: false,
      newPositions: [],
      newSitePosition: [],
      isCreatingZone: true,
      isGeneralStatusHidden: true,
      isAlertsHidden: true,
      isCreatingSite: elementType === 'site'
    })
  }

  getType(match) {
    const {zoneId, subzoneId, siteId} = match
    if (zoneId && subzoneId && siteId) {
      return 'site'
    } else if (zoneId && subzoneId) {
      return 'subzone'
    } else if (zoneId) {
      return 'zone'
    } else {
      return 'general'
    }
  }

  render() {
    return (
      <div className={`map-container ${this.state.isCreatingZone ? 'creating' : ''}`}>
        { this.state.promptElement
          && <div className="prompt-element">
            <div className="content">
              <span>Selecciona elemento a crear: </span>
              <ul className="options">
                <li onClick={() => this.onSelectElement('site')}>Sitio (torre)</li>
                <li onClick={() => this.onSelectElement('subzone')}>Subzona</li>
              </ul>
              <div className="cancel">
                <span
                  className="button"
                  onClick={() => this.onCreate(true)}>Cancelar</span>
              </div>
            </div>
          </div>
        }
        <div className={`general-status ${this.state.isGeneralStatusHidden && this.isWindow !== 'zones' ? 'hidden' : ''} ${this.isWindow === 'zones' ? 'window' : ''}`}>
          <input
            type="button"
            onClick={() => this.hide('general-status')}
            className="close-tab sites"
          />
        {
          this.isWindow !== 'alerts'
          && <ZoneDetail
              onPopWindow={() => this.popWindow('zones')}
              isWindow={this.isWindow}
              zone={this.state.selectedZone || this.props.zones}
              subzone={this.state.selectedSubzone}
              site={this.state.selectedSite}
              onHover={this.onSiteHover}
              type={this.getType(this.props.match.params)}
            />
        }
        </div>
        {
          (this.isWindow !== 'zones' || this.isWindow !== 'alerts')
          && <div className={`map-view`}>
            <div className="actions">
              <ul className="links hiddable">
                <li className="big search" onClick={this.onSearch}><span className="search">Buscar</span></li>
                <li className="big create" onClick={this.onCreate}><span className="create">Crear</span></li>
              </ul>
              <span className="button huge cancel" onClick={this.onCreate}>Cancelar</span>
            </div>
            <Map
              onClick={this.onMapClick}
              center={this.state.currentPosition}
              zoom={this.state.currentZoom}
              onViewportChange={this.onViewportChange}
              onViewportChanged={this.onViewportChanged}
              ref={map => {
                this.map = map
              }}
              animate
              >
              {
                this.state.selectedZone && this.state.selectedZone.subzones && !this.state.selectedSubzone
                && this.state.selectedZone.subzones.map(zone =>
                  <ZonePolygon
                    key={zone._id}
                    zone={zone}
                    highlightedZone={this.state.highlightedZone}
                    onMouseOver={this.onSiteHover}
                    onMouseOut={this.onSiteHover}
                  />
                )
              }
              {
                this.state.selectedSubzone && this.state.selectedSubzone.sites
                && this.state.selectedSubzone.sites.map(site =>
                  <SiteMarker
                    key={site._id}
                    position={site.position}
                    title={site.name}
                  />
                )
              }
              {
                this.state.selectedSubzone && this.state.selectedSubzone.positions
                ? <Polygon
                    positions={[
                      [[-85,-180], [-85,180], [85,180], [85,-180]],
                      [this.state.selectedSubzone.positions]
                    ]}
                    fillOpacity={0.3}
                    color="#666"
                    weight={0}
                    onClick={event => event.stopPropagation() }
                  />
                : (this.state.selectedZone && this.state.selectedZone.positions.length > 1)
                  && <Polygon
                      positions={[
                        [[-85,-180], [-85,180], [85,180], [85,-180]],
                        [this.state.selectedZone.positions]
                      ]}
                      fillOpacity={0.3}
                      color="#666"
                      weight={0}
                      onClick={event => event.stopPropagation() }
                    />
              }
              {
                this.state.selectedZone === null
                && this.props.zones.map(zone =>
                  <ZonePolygon
                    key={zone._id}
                    zone={zone}
                    highlightedZone={this.state.highlightedZone}
                    onMouseOver={this.onSiteHover}
                    onMouseOut={this.onSiteHover}
                  />
                )
              }
              {
                this.state.isCreatingSite ? (
                  this.state.newPositions[0]
                  && <SiteMarker
                      position={this.state.newPositions[0]}
                      title={this.state.newName}
                    />
                ) : (
                  <Polygon
                    color="#aaa"
                    positions={this.state.newPositions}
                  />
                )
              }
              <TileLayer
                url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}${window.devicePixelRatio > 1 ? '@2' : ''}.png`}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
              />
            </Map>
            <CreateZoneBar
              newZoneName={this.state.newName}
              onChange={this.onChange}
              isValid={this.state.isNewZoneValid}
              onSave={this.saveNewZone}
              text={this.isCreatingSite ? 'Traza la zona' : 'Localiza el sitio'}
            />
          </div>
        }
        {
          this.isWindow !== 'zones'
          && <Reports
              isAlertsHidden={this.state.isAlertsHidden}
              onHide={() => this.hide('alerts')}
              isWindow={this.isWindow}
              reports={this.props.reports}
            />
        }
      </div>
    )
  }
}

function mapStateToProps({ zones }) {
  return {
    zones
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setZone: (name, positions) => {
      dispatch(setZone(name, positions))
    }
  }
}

MapView.propTypes = {
  match: PropTypes.object,
  zones: PropTypes.array,
  setZone: PropTypes.func,
  location: PropTypes.object,
  reports: PropTypes.array
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
