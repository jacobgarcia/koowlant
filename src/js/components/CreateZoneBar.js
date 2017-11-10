import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CreateZoneBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowingList: false
    }
  }

  render() {
    const props = this.props
    console.log('new pos', props.newPositions)
    const newPositions = (props.newPositions[0]) || [[],[]]

    return (
      <div className="create-zone-bar">
        <ul className="links">
          {
            props.isCreatingZone
            ? <li className="huge"><span>0 Entidades en la zona</span></li>
            : <li className="huge"><span>{props.text}</span></li>
          }
          {
            props.isCreatingSite
            &&
            <li className="huge short">
              <input type="text"
                placeholder="Latitud"
                value={newPositions[0]}
                onChange={({target}) => props.onPositionChange({latlng: { lat: target.value, lng: newPositions[1] }})}
              />
            </li>
          }
          {
            props.isCreatingSite
            &&
            <li className="huge short">
              <input type="text"
                placeholder="Longitud"
                value={newPositions[1]}
                onChange={({target}) => props.onPositionChange({latlng: { lat: newPositions[1], lng: target.value }})}
              />
            </li>
          }
          {
            props.isCreatingZone
            ? <li className="huge selector">
              <span onClick={() => this.setState(prevState => ({isShowingList: !prevState.isShowingList}))}>Selecciona las entidades</span>
              <ul className={`list ${this.state.isShowingList ? 'visible' : ''}`}>
                {
                  props.states.map((state, index) =>
                    <li
                      key={index}
                      style={{backgroundColor: index % 2 ? '#fff' : '#efefef'}}
                      onClick={() => props.onStateSelect(index, state._id)}
                    >
                      <div className={`selected-radius ${props.selectedStateIndex === index && 'active'}`} />
                      <span>{state.name}</span>
                    </li>
                  )
                }
              </ul>
            </li>
            : <li className="huge">
                <input
                  type="text"
                  name="newName"
                  value={props.newZoneName}
                  placeholder={`Nombre ${
                    (props.elementSelected === 'zone' && 'de la zona') ||
                    (props.elementSelected === 'site' && 'del sitio') ||
                    (props.elementSelected === 'subzone' && 'de la subzona')
                  }...`}
                  onChange={props.onChange}
                />
              </li>
          }
          <li className={`huge ${props.isValid ? 'valid' : 'deactivated'}`}
            onClick={props.onSave}><span>Guardar</span></li>
        </ul>
      </div>
    )
  }
}

CreateZoneBar.propTypes = {
  newZoneName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  elementSelected: PropTypes.string,
  isCreatingZone: PropTypes.bool
}

CreateZoneBar.defaultProps = {
  newPositions: [[],[]]
}

export default CreateZoneBar
