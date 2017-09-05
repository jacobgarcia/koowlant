import React from 'react'
import PropTypes from 'prop-types'

function MiniAlert(props) {
  const getClass = type => {
    switch (type) {
      case 0:
        return 'energy'
      default:
        return 'generic'
    }
  }

  const getText = type => {
    switch (type) {
      case 0:
        return 'Energía'
      default:
        return 'Alerta'
    }
  }

  return (
    <div className={`mini-alert ${getClass(props.type)}`} key={alert}>
      <div>
        <p className="location">Torre {props.site.name}. {props.subzone.name ? `Subzona ${props.subzone.name}. ` : ''} Zona {props.zone.name}.</p>
        <div className="status">
          <p className="type">{getText(props.type)}</p>
          <p className="value">{props.report.sensor.state.value}</p>
        </div>
      </div>
      <div></div>
    </div>
  )
}

MiniAlert.propTypes = {
  type: PropTypes.number,
  site: PropTypes.object.isRequired,
  zone: PropTypes.object.isRequired,
  subzone: PropTypes.object,
  report: PropTypes.object.isRequired
}

export default MiniAlert
