import React from 'react'
import PropTypes from 'prop-types'

import {StatusBar} from './'

function StatusOverall(props) {
  const normal = props.status.length > 0 ? props.status.filter(({name}) => name === 'normal').pop() : { value: 0}

  const getTitle = (type, name) => {
    switch (type) {
      case 'zone': return 'Zona ' + name
      case 'subzone': return 'Subzona ' + name
      default: return 'Estatus General'
    }
  }

  return (
    <div className="overall">
      <h3>{getTitle(props.type, props.zone ? props.zone.name : null)}</h3>
      <div className="sites-status">
        <StatusBar status={props.status}/>
        <p><span>{normal.value * 100}%</span> de funcionalidad, <span className="alert"></span> 18 Alertas totales</p>
        <p>Atender</p>
      </div>
    </div>
  )
}

StatusOverall.propTypes = {
  type: PropTypes.string.isRequired,
  zone: PropTypes.object,
  // status: PropTypes.object
}

export default StatusOverall
