import React from 'react'

function MiniAlert(props) {
  return (
    <div className="mini-alert" key={alert}>
      <div></div>
      <div>
        <p>{props.type}</p>
        <p>Torre {props.site}. Zona {props.zone}.</p>
      </div>
      <div></div>
    </div>
  )
}

export default MiniAlert
