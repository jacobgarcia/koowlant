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
            props.reports &&
            props.reports.map(report =>
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
  )
}

Reports.propTypes = {
  isAlertsHidden: PropTypes.bool,
  onHide: PropTypes.func,
  isWindow: PropTypes.bool,
  reports: PropTypes.array
}

export default Reports
