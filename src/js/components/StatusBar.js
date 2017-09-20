import React from 'react'
import PropTypes from 'prop-types'

function StatusBar(props) {
  return (
    <div className="sites-graph">
      <div className="total">
          {
            (props.status && props.status.length > 0)
            && props.status.map((status, index) =>
              <div
                key={index}
                className={status.name}
                style={{width: `${status.value * 100}%`}}
              />
            )
        }
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  status: PropTypes.array
}

export default StatusBar
