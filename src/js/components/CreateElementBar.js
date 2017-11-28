import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CreateElementBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEntities: false
    }
  }

  render() {
    const { props, state } = this
    return (
      <div className={`create-bar ${props.className}`} onMouseOver={props.onMouseOver}>
          <div className="description">
            <p>{props.isCreatingSite ? 'Sitio' : props.isCreatingSubzone ? 'Subzona' : 'Zona'}</p>
          </div>
          <div>
            <input type="text" placeholder="Nombre..." onChange={props.onNameChange}/>
          </div>
          {
            props.isCreatingSite
            ?
            <div className="coordinates">
              <input
                type="text"
                placeholder="Latitud"
                value={(props.positions && props.positions.length > 0) ? props.positions[props.positions.length - 1][0] : ''}
                name="lat"
                onChange={props.onPositionsChange}
              />
              <input
                type="text"
                placeholder="Longitud"
                value={(props.positions && props.positions.length > 0) ? props.positions[props.positions.length - 1][1] : ''}
                name="lng"
                onChange={props.onPositionsChange}
              />
            </div>
            : !props.isCreatingSubzone
            &&
            <div className="add-entities">
              <p onClick={() => this.setState(prev => ({ showEntities: !prev.showEntities }))}>Añadir estados</p>
              <ul className={state.showEntities ? '' : 'hidden'}>
                {
                  [{name: 'Estado de México'}, {name: 'Estado de México'}, {name: 'Estado de México'}, {name: 'Estado de México'}, {name: 'Estado de México'}, , {name: 'Estado de México'}, , {name: 'Estado de México'}]
                  .map((entity, index) =>
                    <li key={index}>
                      <input type="checkbox" id={index}/>
                      <label htmlFor={index}>{entity.name}</label>
                    </li>
                  )
                }
              </ul>
            </div>
          }
          <input
            type="button"
            className={`${props.isNewElementValid ? '' : 'disabled'} destructive`}
            value="Crear"
            onClick={() => props.isNewElementValid ? props.onCreate() : null}
          />
      </div>
    )
  }
}

export default CreateElementBar
