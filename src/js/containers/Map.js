/* eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import qs from 'query-string'
import { Map, TileLayer, Polygon } from 'react-leaflet'

import { setZone } from '../actions'
import { CreateZoneBar, ZoneDetail, Reports, ZonePolygon, SiteMarker, Search } from '../components'
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
      isCreatingZone: false,
      isSearching: false
    }

    this.hide = this.hide.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.saveNewZone = this.saveNewZone.bind(this)
    this.onChange = this.onChange.bind(this)
    this.isNewElementValid = this.isNewElementValid.bind(this)
    this.onSiteHover = this.onSiteHover.bind(this)
    this.popWindow = this.popWindow.bind(this)
    this.changeSitesView = this.changeSitesView.bind(this)
    this.onSelectElement = this.onSelectElement.bind(this)
    this.getType = this.getType.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  isNewElementValid() {
    const newName = this.state.newName
    const newPositions = this.state.newPositions

    let isNewElementValid = false
    if (this.state.isCreatingSite) {
      isNewElementValid = newName.split('').length > 2 && newPositions.length === 1
    } else {
      isNewElementValid = newName.split('').length > 2 && newPositions.length > 2
    }

    this.setState({
      isNewElementValid
    })

    return isNewElementValid
  }

  hide(componentName) {
    this.setState(prevState => ({
      isGeneralStatusHidden: componentName === 'alerts' ? true : !prevState.isGeneralStatusHidden,
      isAlertsHidden: componentName === 'general-status' ? true : !prevState.isAlertsHidden,
    }))
  }

  saveNewZone() {
    if (!this.isNewElementValid()) return

    const { newName, newPositions } = this.state

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
    }, () => this.isNewElementValid())
  }

  onSearch() {
    this.setState(prevState => ({
      isSearching: !prevState.isSearching,
    }))
  }

  onCreate() {
    // If we are in a selected zone
    this.setState(prevState => ({
      newPositions: [],
      isCreatingZone: !prevState.isCreatingZone,
      isCreatingSite: (this.state.selectedSubzone !== null) && !prevState.isCreatingZone,
      isGeneralStatusHidden: true,
      isAlertsHidden: true
    }))
  }

  componentWillReceiveProps(nextProps) {
    const {zoneId, subzoneId, siteId} = nextProps.match.params
    console.log({nextProps})

    const selectedZone = this.props.zones.filter(zone => zone._id === zoneId).pop()
    const selectedSubzone = selectedZone ? selectedZone.subzones.filter(subzone => subzone._id === subzoneId).pop() : null
    const selectedSite = (selectedZone && selectedSubzone) ? selectedSubzone.sites.filter(site => site._id === siteId).pop() : null

    console.log({selectedZone, selectedSubzone, selectedSite})

    if (!selectedZone) {
      console.log('Selecting state... 1')
      this.setState({
        selectedZone: null,
        selectedSubzone: null,
        currentZoom: 5,
        currentPosition: [23.2096057, -101.6139503]
      })
    } else if ((this.state.selectedZone && zoneId !== this.state.selectedZone._id) || !subzoneId) {
      console.log('Selecting state... 2')
      this.setState({
        selectedZone,
        currentZoom: 5.5,
        currentPosition: selectedZone.positions[0] ? getAreaCenter(selectedZone.positions[0]) : [23.2096057, -101.6139503],
        selectedSubzone: null,
        selectedSite: null
      })
    } else if (selectedSubzone && !selectedSite && (!this.state.selectedSubzone || (this.state.selectedSubzone))) {
      console.log('Selecting state... 3')
      this.setState({
        selectedSubzone,
        selectedSite: null,
        currentZoom: 6.7
      }, () => {
        selectedSubzone.positions[0]
        && this.setState({currentPosition: getAreaCenter(selectedSubzone.positions[0])})
      })
    } else if (selectedSite && (!this.state.selectedSite || (this.state.selectedSite && subzoneId !== this.state.selectedSite._id))) {
      console.log('Selecting state... 4')
      this.setState({
        selectedZone,
        selectedSubzone,
        selectedSite,
        currentZoom: 10.5
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
      this.isNewElementValid()
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
      <div className={`map-container ${this.state.isCreatingZone ? 'creating' : ''} ${(this.state.isGeneralStatusHidden && this.state.isAlertsHidden) ? 'awake' : 'sleeping'}`}>
        <Search
          isVisible={this.state.isSearching}
          zones={this.props.zones}
          onClose={this.onSearch}
          reports={this.props.reports}
        />
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
        <div className={`general-status ${this.state.isGeneralStatusHidden && this.isWindow !== 'zones' ? 'hidden' : 'active'} ${this.isWindow === 'zones' ? 'window' : ''}`}>
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
              reports={this.props.reports}
              type={this.getType(this.props.match.params)}
            />
        }
        </div>
        {
          (this.isWindow !== 'zones' || this.isWindow !== 'alerts')
          && <div className={`map-view`}>
            <div className="actions">
              <div>
                {
                  this.state.selectedZone !== null
                    && <span className="button huge back" onClick={() => {
                      if (this.state.isCreatingSite || this.state.isCreatingZone) this.onCreate()
                      if (this.state.selectedSite) this.props.history.push(`/zones/${this.state.selectedZone._id}/${this.state.selectedSubzone._id}`)
                      else if (this.state.selectedSubzone) this.props.history.push(`/zones/${this.state.selectedZone._id}`)
                      else if (this.state.selectedZone) this.props.history.push('/')
                  }}>Regresar <span>{this.state.selectedSubzone ? (this.state.selectedSite ? 'Subzona' : 'Subzonas') : 'General'}</span></span>
                }
              </div>
              <ul className="links hiddable">
                <li className="big search"
                  onClick={this.onSearch}>
                  <span className="search">Buscar</span>
                </li>
                <li className="big create"
                  onClick={this.onCreate}>
                  <span className="create">{this.state.selectedZone ? (this.state.selectedSubzone ? 'Sitio' : 'Subzona') : 'Zona'}</span>
                </li>
              </ul>
              <div>
                <span className="button huge cancel" onClick={this.onCreate}>Cancelar</span>
              </div>
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
                // Render subzones in a selected zone
                (this.state.selectedZone && this.state.selectedZone.subzones && !this.state.selectedSubzone)
                && this.state.selectedZone.subzones.map(subzone =>
                  subzone.positions
                  && <ZonePolygon
                      key={subzone._id}
                      zone={subzone}
                      reports={this.props.reports.filter(({site}) => subzone.sites.find(({key}) => key === site.key))}
                      highlightedZone={this.state.highlightedZone}
                      onMouseOver={this.onSiteHover}
                      onMouseOut={this.onSiteHover}
                      onClick={() => {
                        if (this.state.isCreatingSite || this.state.isCreatingZone) return
                        this.props.history.push(`/zones/${this.state.selectedZone._id}/${subzone._id}`)}
                      }
                    />
                )
              }
              {
                // Render sites in a selected subzone
                this.state.selectedSubzone && this.state.selectedSubzone.sites
                && this.state.selectedSubzone.sites.map(site =>
                  <SiteMarker
                    key={site._id}
                    position={site.position}
                    site={site}
                    title={site.name}
                    highlightedZone={this.state.highlightedZone}
                    onMouseEvent={this.onSiteHover}
                    onClick={() => this.props.history.push(this.props.location.pathname + '/' + site._id)}
                  />
                )
              }
              {
                // Render gray area when there's a selected subzone
                this.state.selectedSubzone && this.state.selectedSubzone.positions
                ? <Polygon
                    positions={[
                      [[-85,-180], [-85,180], [85,180], [85,-180]],
                      [...this.state.selectedSubzone.positions]
                    ]}
                    fillOpacity={0.3}
                    color="#666"
                    weight={0}
                    onClick={() => this.props.history.push('/')}
                  />
                : (this.state.selectedZone && this.state.selectedZone.positions.length > 1)
                  && <Polygon
                      positions={[
                        [[-85,-180], [-85,180], [85,180], [85,-180]],
                        [...this.state.selectedZone.positions]
                      ]}
                      fillOpacity={0.3}
                      color="#666"
                      weight={0}
                      onClick={event => event.stopPropagation() }
                    />
              }
              {
                // Render all zones
                (this.state.selectedZone === null)
                && this.props.zones.map(zone =>
                  <ZonePolygon
                    key={zone._id}
                    zone={zone}
                    highlightedZone={this.state.highlightedZone}
                    reports={
                      this.props.reports.filter(({site}) =>
                      zone.subzones.some(subzone =>
                        subzone.sites.find(({key}) => key === site.key))
                      )
                    }
                    onMouseOver={this.onSiteHover}
                    onMouseOut={this.onSiteHover}
                    onClick={() => {
                      if (this.state.isCreatingSite || this.state.isCreatingZone) return
                      this.props.history.push(`/zones/${zone._id}`)}
                    }
                  />
                )
              }
              {
                this.state.isCreatingSite ? (
                  this.state.newPositions[0]
                  && <SiteMarker
                      position={this.state.newPositions[0]}
                      title={this.state.newName}
                      site={{name: this.state.newName}}
                      deactivated
                    />
                ) : (
                  <Polygon
                    color="red"
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
              elementSelected={this.state.selectedZone ? (this.state.selectedSubzone ? 'site' : 'subzone') : 'zone'}
              newZoneName={this.state.newName}
              onChange={this.onChange}
              isValid={this.state.isNewElementValid}
              onSave={this.saveNewZone}
              text={this.isCreatingSite ? 'Posiciona el sitio' : 'Traza la zona'}
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

function mapStateToProps({ zones, reports }) {
  return {
    zones,
    reports
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
