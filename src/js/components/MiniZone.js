import React from 'react'
import PropTypes from 'prop-types'

import { hashCode, intToRGB } from '../SpecialFunctions'

function MiniZone(props) {
  return (
    <div className={`mini-zone ${props.active ? 'active' : ''}`} onMouseEnter={() => props.onHover(props.id)} onMouseLeave={() => props.onHover(null)}>
      <div className="status-text">
        <div className="status-color" style={{background: '#' + intToRGB(hashCode(props.name))}}></div>
        <h3>Zona {props.name}</h3>
        <p>{props.subzones} Sub-zonas</p>
        <p>{props.sites} torres</p>
        <p>{props.admins} admin</p>
      </div>
      <div className="status-graph">
        <div>
          <p>{props.reports.alerts.length} Alertas</p>
          <p>{props.reports.warnings.length} Precauciones</p>
        </div>
        <div className="graph"></div>
      </div>
    </div>
  )
}

MiniZone.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  subzones: PropTypes.array,
  sites: PropTypes.array,
  admins: PropTypes.array,
  reports: PropTypes.object,
  onHover: PropTypes.func,
  active: PropTypes.bool
}

export default MiniZone
