import React from 'react'
import PropTypes from 'prop-types'

import { MiniAlert } from './'

function Reports(props) {
  return (
    <div className={`alerts ${props.isAlertsHidden ? 'hidden' : ''}`}>
      <input
        type="button"
        onClick={props.onHide}
        className="close-tab alerts-side"
      />
      <div className="side-content">
        { props.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
        <div className="general-alerts">
          <h2>Alertas</h2>
          <span>4 sin revisar</span>
        </div>
        <div className="mini-alerts-container">

            <div className="mini-alert battery">
              <div className="details">
                <div><span>Zona A Torre 5</span></div>
                <p>Batería baja 18%</p>
              </div>
              <div className="time">
                <span>23/05/2017</span>
                <span>20:24</span>
              </div>
            </div>
            <div className="mini-alert temperature">
              <div className="details">
                <div><span>Zona A Torre 5</span></div>
                <p>Temperatura alta 70°</p>
              </div>
              <div className="time">
                <span>23/05/2017</span>
                <span>20:24</span>
              </div>
            </div>
            <div className="mini-alert fuel">
              <div className="details">
                <div><span>Zona A Torre 5</span></div>
                <p>Combustible bajo 15%</p>
              </div>
              <div className="time">
                <span>23/05/2017</span>
                <span>20:24</span>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}

Reports.propTypes = {
  isAlertsHidden: PropTypes.bool,
  onHide: PropTypes.func,
  isWindow: PropTypes.bool,
  reports: PropTypes.array
}

export default Reports
