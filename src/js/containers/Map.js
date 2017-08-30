/* eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'query-string'
import { Map, TileLayer, Polygon } from 'react-leaflet'

import { setZone } from '../actions'
import { MiniZone, MiniAlert, CreateZoneBar } from '../components'
import { hashCode, intToRGB } from '../SpecialFunctions'

class MapView extends Component {
  constructor(props) {
    super(props)
    this.isWindow = qs.parse(props.location.search).isWindow

    this.state = {
      isCreatingZone: false,
      isGeneralStatusHidden: true,
      isAlertsHidden: true,
      currentZoom: 5.25,
      currentPosition: [23.2096057, -101.6139503],
      highlightedZone: null,
      zones: props.zones,
      selectedZone: null,
      newZoneName: '',
      newZonePositions: []
    }

    this.hide = this.hide.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.saveNewZone = this.saveNewZone.bind(this)
    this.onChange = this.onChange.bind(this)
    this.isNewZoneValid = this.isNewZoneValid.bind(this)
    this.onSiteHover = this.onSiteHover.bind(this)
    this.popWindow = this.popWindow.bind(this)
  }

  isNewZoneValid() {
    const newZoneName = this.state.newZoneName
    const newZonePositions = this.state.newZonePositions
    const isNewZoneValid = (newZoneName !== '' && newZoneName.length > 3 && newZonePositions.length > 3)
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
    const positions = this.state.newZonePositions

    this.props.setZone(name, positions)

    this.setState({
      newZonePositions: [],
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
    this.setState(prevState => ({
      newZonePositions: [],
      isCreatingZone: !prevState.isCreatingZone,
      isGeneralStatusHidden: true,
      isAlertsHidden: true
    }))
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

    this.setState(prevState => ({
      newZonePositions: prevState.newZonePositions.concat([newPosition])
    }), () => this.isNewZoneValid())
  }

  popWindow(section) {
    const { path } = this.props.match
    window.open(`${window.host}${path}?isWindow=${section}`,'Telco','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=493')
  }

  render() {
    return (
      <div className={`map-container ${this.state.isCreatingZone ? 'creating' : ''}`}>
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
              <div className="mini-sites-container">
                <div className="mini-sites-menu">
                  <div>
                    <span>Mostrar</span>
                  </div>
                  <div>Dinámica</div>
                </div>
                {
                  this.state.zones.map(zone =>
                    <Link to={`/zones/${zone.name}`} key={zone.name}>
                      <MiniZone
                        id={zone.name}
                        name={zone.name}
                        subzones={[]}
                        sites={[]}
                        admins={[]}
                        reports={{ alerts: [], warnings: []}}
                        highlighted={this.state.highlightedZone}
                        onHover={this.onSiteHover}
                        active={this.state.highlightedZone === zone.name}
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
              <h1>ZONE DETAIL</h1>
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
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {
                this.props.zones.map(({name, positions}, index) =>
                  <Polygon
                    key={index}
                    color={'#' + intToRGB(hashCode(name))}
                    positions={positions}
                    fillOpacity={this.state.highlightedZone === name ? 0.8 : 0.2}
                    onMouseOver={() => this.onSiteHover(name)}
                    onMouseOut={() => this.onSiteHover(null)}
                  />
                )
              }
              <Polygon color="#aaa" positions={this.state.newZonePositions} />
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
              <div>
                <h2>Zona A</h2><span>11 Alertas</span>
              </div>
              <div className="mini-alerts-container">
                {
                  [0,1,2,3,4].map(id =>
                    <MiniAlert
                      key={id}
                      type={''}
                      site={''}
                      zone={''}
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
  location: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
