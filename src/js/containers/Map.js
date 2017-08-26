import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet'

class MapView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isGeneralStatusHidden: true,
      isAlertsHidden: true,
      currentZoom: 5.25,
      currentPosition: [23.2096057, -101.6139503],
      polygons: []
    }

    this.hide = this.hide.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
  }

  hide(componentName) {
    switch (componentName) {
      case 'general-status':
        this.setState({
          isGeneralStatusHidden: !this.state.isGeneralStatusHidden,
          isAlertsHidden: true,
        })
        break
      case 'alerts':
        this.setState({
          isGeneralStatusHidden: true,
          isAlertsHidden: !this.state.isAlertsHidden,
        })
        break
      default:
        break
    }
  }

  onMapClick(event) {
    const { lat, lng } = event.latlng

    let polygons = this.state.polygons

    if (polygons.length === 0) {
      polygons.push([[lat,lng]])
    } else {
      polygons[0].push([lat,lng])
    }

    this.setState({
      polygons
    }, () => console.log('RESULT', polygons))

  }

  render() {

    const polygon = [[19.56755420165624, -99.2889404296875], [19.432924246022402, -99.31915283203126],[19.308551284387825, -99.25323486328126],[19.15814103818772, -99.04724121093751],[19.44328437042322, -98.61877441406251],[19.789964572087467, -98.86871337890625]]

    return (
      <div className="map-container">
        <div className={`general-status ${this.state.isGeneralStatusHidden ? 'hidden' : ''}`}>
          <input
            type="button"
            onClick={() => this.hide('general-status')}
            className="close-tab sites"
          />
          <div className="side-content">
            <span className="pop-window">Hacer ventana</span>
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
                [0,1,2,3,4,5,6,7,8,9].map(number =>
                  <div className="mini-site" key={number}>
                    <div className="status-text">
                      <div className="status-color"></div>
                      <h3>Zona {number}</h3>
                      <p>11 Sub-zonas</p>
                      <p>640 torres</p>
                      <p>7 admin</p>
                    </div>
                    <div className="status-graph">
                      <div>
                        <p>11 Alertas</p>
                        <p>2 Precauciones</p>
                      </div>
                      <div className="graph"></div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="map-view">
          <Map
            onClick={this.onMapClick}
            center={this.state.currentPosition}
            zoom={this.state.currentZoom}>
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* {
              this.state.polygons.map((positions, index) => {
                console.log('Polygon', positions)
                return (
                  <Polygon
                    key={index}
                    positions={positions}
                    color="red"
                  />
                )
              })
            } */}
            <Polygon color="blue" positions={this.state.polygons[0] || []} />
            <Polygon color="purple" positions={polygon} />
            <Marker
              position={this.state.currentPosition}
              draggable
              // icon={{
              //   iconUrl: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
              //   iconSize: [38, 95]
              // }}
              >
              <Popup>
                <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
              </Popup>
            </Marker>
          </Map>
        </div>
        <div className={`alerts ${this.state.isAlertsHidden ? 'hidden' : ''}`}>
          <input
            type="button"
            onClick={() => this.hide('alerts')}
            className="close-tab alerts-side"
          />
          <div className="side-content">
            <span className="pop-window">Hacer ventana</span>
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
                [0,1,2,3,4].map(alert =>
                  <div className="mini-alert" key={alert}>
                    <div></div>
                    <div>
                      <p>Tipo de Alerta</p>
                      <p>Torre 1. Zona A.</p>
                    </div>
                    <div></div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MapView
