import React from 'react'
import PropTypes from 'prop-types'

function Prompt(props) {
  return (
    <div className={`prompt ${props.className}`} onClick={props.onDismiss}>
      { props.children }
    </div>
  )
}

Prompt.defaultProps = {
  onDismiss: () => {}
}

Prompt.propTypes = {
  onDismiss: PropTypes.func
}

export default Prompt
