/* eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'query-string'
import { Map, TileLayer, Polygon, Popup, Marker } from 'react-leaflet'

import { setZone } from '../actions'
import { MiniZone, MiniAlert, CreateZoneBar } from '../components'
import { hashCode, intToRGB } from '../SpecialFunctions'

class MapView extends Component {
  constructor(props) {
    super(props)
    this.isWindow = qs.parse(props.location.search).isWindow

    const zoneId = props.match.params.zoneId
    const selectedZone = props.zones.filter(zone => zone._id === zoneId).pop()

    this.state = {
      isCreatingZone: false,
      isGeneralStatusHidden: true,
      isAlertsHidden: false,
      currentZoom: 5.25, // TODO load from localStorage
      currentPosition: [23.2096057, -101.6139503], // TODO load from localStorage
      highlightedZone: null,
      zones: props.zones,
      selectedZone,
      newZoneName: '',
      newPositions: [],
      sitesViewStyle: 'list', // TODO load from localStorage
      sitesViewOrdering: 'static', // TODO load from localStorage
      isCreatingSite: false
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
  }

  isNewZoneValid() {
    const newZoneName = this.state.newZoneName
    const newPositions = this.state.newPositions
    const isNewZoneValid = (newZoneName.split('').length > 2 && newPositions.length > 2)

    this.setState({
      isNewZoneValid
    })
    return isNewZoneValid
  }

  hide(componentName) {
    switch (componentName) {
      case 'general-status':
        this.setState(prevState => ({
          isGeneralStatusHidden: !prevState.isGeneralStatusHidden,
          isAlertsHidden: true,
        }))
        break
      case 'alerts':
        this.setState(prevState => ({
          isGeneralStatusHidden: true,
          isAlertsHidden: !prevState.isAlertsHidden,
        }))
        break
      default:
        break
    }
  }

  saveNewZone() {
    if (!this.isNewZoneValid()) return

    const name = this.state.newZoneName
    const positions = this.state.newPositions

    this.props.setZone(name, positions)

    this.setState({
      newPositions: [],
      newZoneName: '',
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
    const zoneId = nextProps.match.params.zoneId
    if (zoneId !== this.state.selectedZone) {
      this.setState({
        selectedZone: this.props.zones.filter(zone => zone._id === zoneId).pop()
      })
    }
  }

  onSiteHover(siteId) {
    this.setState({
      highlightedZone: siteId
    })
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
    }), () => this.isNewZoneValid())
  }

  popWindow(section) {
    const { path } = this.props.match
    window.open(`${window.host}${path}?isWindow=${section}`,'Telco','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=493')
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

  render() {
    return (
      <div className={`map-container ${this.state.isCreatingZone ? 'creating' : ''}`}>
        { this.state.promptElement
          ? <div className="prompt-element">
            <div className="content">
              <span>Selecciona elemento a crear:</span>
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
          : null
        }
        <div className={`general-status ${this.state.isGeneralStatusHidden && this.isWindow !== 'zones' ? 'hidden' : ''} ${this.isWindow === 'zones' ? 'window' : ''}`}>
          <input
            type="button"
            onClick={() => this.hide('general-status')}
            className="close-tab sites"
          />
        <Route exact path="/" render={() =>
            <div className="side-content">
              { this.isWindow === 'zones' ? null : <span
                className="pop-window"
                onClick={() => this.popWindow('zones')}>Hacer ventana</span>}
              <div className="overall">
                <span>Estatus</span>
                <div className="sites-status">
                  <div className="sites-graph">
                    <h3>Sitios</h3>
                    <div className="total">
                      <div className="current"></div>
                    </div>
                  </div>
                  <p><span>93.2%</span> de funcionalidad, <span className="alert"></span> 18 Alertas totales</p>
                  <p>Atender</p>
                </div>
              </div>
              <div className="mini-sites-menu">
                <div>
                  <span>Mostrar</span>
                </div>
                <div className="view-ordering">
                  <p>{this.state.sitesViewOrdering}</p>
                  <span className="dinamic small-icon" />
                  <span className="static small-icon" />
                </div>
                <div className="view-settings">
                  <span className={`list small-icon ${this.state.sitesViewStyle === 'list' ? '' : 'deactive'}`} onClick={() => this.changeSitesView('list')}/>
                  <span className={`grid small-icon ${this.state.sitesViewStyle === 'grid' ? '' : 'deactive'}`} onClick={() => this.changeSitesView('grid')}/>
                </div>
              </div>
              <div className={`mini-sites-container ${this.state.sitesViewStyle}`}>
                {
                  this.props.zones.map(zone =>
                    <Link
                      to={`/zones/${zone._id}`}
                      key={zone._id}>
                      <MiniZone
                        id={zone._id}
                        name={zone.name}
                        subzones={[]}
                        sites={[]}
                        admins={[]}
                        reports={this.props.reports}
                        highlighted={this.state.highlightedZone}
                        onHover={this.onSiteHover}
                        active={this.state.highlightedZone === zone._id}
                      />
                    </Link>
                  )
                }
              </div>
            </div>
        }/>
        {
          this.isWindow === 'alerts'
          ? null
          : <Route exact path="/zones/:zoneId" render={() =>
            <div className="side-content">
              <div className="top">
                <span className="back"><Link to="/">Regresar</Link></span>
                { this.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
              </div>
              <h3>ZONE DETAIL</h3>
            </div>
          }/>
        }
        </div>
        {
          this.isWindow === 'zones' || this.isWindow === 'alerts'
          ? null
          : <div className={`map-view`}>
            <div className="actions">
              <ul className="links hiddable">
                <li className="big" onClick={this.onCreate}><span className="create">Crear</span></li>
                <li className="big" onClick={this.onSearch}><span className="search">Buscar</span></li>
              </ul>
              <span className="button huge cancel" onClick={this.onCreate}>Cancelar</span>
            </div>
            <Map
              onClick={this.onMapClick}
              center={this.state.currentPosition}
              zoom={this.state.currentZoom}
              >
              {
                this.state.selectedZone && this.state.selectedZone.positions.length > 1
                ? <Polygon
                  positions={[
                    [[-85,-180], [-85,180], [85,180], [85,-180]],
                    [this.state.selectedZone.positions]
                  ]}
                  fillColor="#000"
                  fillOpacity={0.1}
                  color={'#' + intToRGB(hashCode(this.state.selectedZone.name))}
                  onClick={event => event.stopPropagation() }
                />
                : null
              }
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {
                this.state.selectedZone
                ? null
                : this.props.zones.map(({name, _id, positions}, index) =>
                  <Polygon
                    key={index}
                    color={'#' + intToRGB(hashCode(name))}
                    positions={positions}
                    fillOpacity={this.state.highlightedZone === _id ? 0.8 : 0.2}
                    onMouseOver={() => this.onSiteHover(_id)}
                    onMouseOut={() => this.onSiteHover(null)}
                  />
                )
              }
              {
                this.state.isCreatingSite
                ? (
                  this.state.newPositions[0]
                  ? <Marker position={this.state.newPositions[0]}>
                      <Popup>
                        <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                      </Popup>
                    </Marker>
                  : null
                  )
                : <Polygon
                    color="#aaa"
                    positions={this.state.newPositions}
                  />
              }
            </Map>
            <CreateZoneBar
              newZoneName={this.state.newZoneName}
              onChange={this.onChange}
              isValid={this.state.isNewZoneValid}
              onSave={this.saveNewZone}
            />
          </div>
        }
        {
          this.isWindow === 'zones'
          ? null
          : <div className={`alerts ${this.state.isAlertsHidden ? 'hidden' : ''}`}>
            <input
              type="button"
              onClick={() => this.hide('alerts')}
              className="close-tab alerts-side"
            />
            <div className="side-content">
              { this.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
              <div className="general-alerts">
                <h3>Alertas totales</h3>
                <p>18</p>
              </div>
              <div>
                <p>Mostrando <span>Zona A</span> <span>Eliminar selección</span></p>
                <div>
                  <p>Alertas</p>
                  <input type="button"/>
                  <input type="button"/>
                </div>
              </div>
              <div className="zone-section">
                <h2>Zona A</h2><span>11 Alertas</span>
              </div>
              <div className="mini-alerts-container">
                {
                  this.props.reports.map(report =>
                    <MiniAlert
                      key={report._id}
                      type={report.type}
                      report={report}
                      site={report.site}
                      zone={report.zone}
                      subzone={report.subZone}
                    />
                  )
                }
              </div>
            </div>
          </div>
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
