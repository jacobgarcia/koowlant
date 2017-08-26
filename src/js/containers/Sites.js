import React, { Component } from 'react'
// import PropTypes from 'prop-types'

class Sites extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="sites">
        <div className="sites-nav">
          <div className="view-settings">
            <div className="selector">
              <label htmlFor="dinamic">Dinámica</label>
              <input type="radio" id="dinamic"/>
              <label htmlFor="static">Estática</label>
              <input type="radio" id="static"/>
            </div>
            <div className="size">
              <label htmlFor="list"></label>
              <input type="radio" id="list"/>
              <label htmlFor="grid"></label>
              <input type="radio" id="grid"/>
              <label htmlFor="grid-small"></label>
              <input type="radio" id="grid-small"/>
            </div>
          </div>
          <div className="actions">
            <div>
              <span>Añadir nueva:</span>
              <div className="selector">
                <label htmlFor="zone">Zona</label>
                <input type="radio" id="zone"/>
                <label htmlFor="site">Sitio</label>
                <input type="radio" id="site"/>
              </div>
            </div>
            <div>
              <span className="button window">Hacer ventana</span>
            </div>
          </div>
        </div>
        <div className="content">
          <div>
            <h6>Por atender:</h6>
            <div className="sites-scroll-container">
              {
                [0,1,2,3].map(number =>
                  <div key={number} className="site-mini" />
                )
              }
            </div>
            <div className="zones-container">
              <div className="zone"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Sites
