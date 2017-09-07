import React from 'react'
import PropTypes from 'prop-types'

import { getTypeClass, getTypeText } from '../Decoder'

function MiniAlert(props) {

  const date = new Date(props.report.timeStamp)

  return (
    <div className={`mini-alert ${getTypeClass(props.type)}`} key={alert}>
      <div>
        <p className="location">Torre {props.site.name}. {props.subzone.name ? `Subzona ${props.subzone.name}. ` : ''} Zona {props.zone.name}.</p>
        <div className="status">
          <p className="type">{getTypeText(props.type)}</p>
          <p className="value">{props.report.sensor.state.value}</p>
        </div>
      </div>
      <div>
        <span className="date">{`${date.getMinutes()}:${date.getHours()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
        { props.report.checked ? null : <p className="check">Sin revisar</p> }
      </div>
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
