import React from 'react'

function StatusBar(props) {
  return (
    <div className="sites-graph">
      <div className="total">
          {
            props.status && props.status.length > 0
            ? props.status.map((status, index) =>
              <div key={index} className={status.name} style={{width: `${status.value*100}%`}} />
            )
            : null
        }
      </div>
    </div>
  )
}

export default StatusBar
