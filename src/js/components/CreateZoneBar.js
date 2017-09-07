import React from 'react'
import PropTypes from 'prop-types'

function CreateZoneBar(props) {
  return (
    <div className="create-zone-bar">
      <ul className="links">
        <li className="huge"><span>{props.text}</span></li>
        <li className="huge">
          <input
            type="text"
            name="newName"
            value={props.newZoneName}
            placeholder="Nombre de la zona..."
            onChange={props.onChange}
          />
        </li>
        <li className={`huge ${props.isValid ? 'valid' : 'deactivated'}`}
          onClick={props.onSave}><span>Guardar</span></li>
      </ul>
    </div>
  )
}

CreateZoneBar.propTypes = {
  newZoneName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string
}
export default CreateZoneBar
