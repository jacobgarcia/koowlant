import React from 'react'
import PropTypes from 'prop-types'

import {StatusBar} from './'

function StatusOverall(props) {
  const normal = props.status.length > 0 ? props.status.filter(({name}) => name === 'normal').pop() : { value: 0}

  const getTitle = (type, props) => {
    switch (type) {
      case 'zone': return 'Zona ' + props.zone.name
      case 'subzone': return 'Subzona ' + props.zone.name
      case 'site': return 'Torre ' + props.site.name
      default: return 'Estatus General'
    }
  }

  return (
    <div className="overall">
      <h3>{getTitle(props.type, props)}</h3>
      <div className="sites-status">
        <StatusBar status={props.status}/>
        <p><span>{normal.value * 100}%</span> de funcionalidad, <span className="alert"></span> 18 Alertas totales</p>
      </div>
    </div>
  )
}

StatusOverall.propTypes = {
  type: PropTypes.string.isRequired,
  zone: PropTypes.object,
  site: PropTypes.object,
  status: PropTypes.array
}

export default StatusOverall
