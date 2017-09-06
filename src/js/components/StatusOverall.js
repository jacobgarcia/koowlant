import React from 'react'

import {StatusBar} from './'

function StatusOverall(props) {
  const normal = props.status.length > 0 ? props.status.filter(({name}) => name === 'normal').pop() : { value: 0}
  console.log(props)

  return (
    <div className="overall">
      <h3>Estatus general</h3>
      <div className="sites-status">
        <StatusBar status={props.status}/>
        <p><span>{normal.value * 100}%</span> de funcionalidad, <span className="alert"></span> 18 Alertas totales</p>
        <p>Atender</p>
      </div>
    </div>
  )
}

export default StatusOverall
