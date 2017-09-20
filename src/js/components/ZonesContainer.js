import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { MiniZone } from './'

function ZonesContainer(props) {

  const getMiniZoneLink = zone => {
    switch (props.type) {
      case 'general': return `/zones/${zone._id}`
      case 'zone': return `/zones/${props.zone._id}/${zone._id}`
      case 'subzone': return `/zones/${props.zone._id}/${props.subzone._id}/${zone._id}`
      case 'site': return 'Torre ' + name
      default: return `/`
    }
  }

  const getElements = type => {
    switch (type) {
      case 'general': return props.zones
      case 'zone': return props.zone.subzones
      case 'subzone': return props.subzone.sites
      case 'site': return props.site.sensors
      default: return []
    }
  }

  const elements = getElements(props.type)

  return (
    <div>
      {
        props.type === 'site'
        && <div className="sensors-cameras">
            <span>Sensores</span>
            <span>Cámaras</span>
          </div>
      }
      <div className="mini-sites-menu">
        <div className="view-ordering">
          <span className="dynamic small-icon" />
          <span className="static small-icon" />
        </div>
        <div className="view-settings">
          <span
            className={`list small-icon ${props.viewStyle === 'list' ? '' : 'deactive'}`}
            onClick={() => props.changeSitesView('list')}
          />
          <span
            className={`grid small-icon ${props.viewStyle === 'grid' ? '' : 'deactive'}`}
            onClick={() => props.changeSitesView('grid')}
          />
        </div>
      </div>
      <div className={`mini-sites-container ${props.viewStyle}`}>
        {
          elements
          && elements.map(element =>
            <Link
              to={getMiniZoneLink(element)}
              key={element._id}>
              <MiniZone
                {...props}
                id={element._id}
                name={element.name}
                zone={element}
                active={props.highlightedZone === element._id}
              />
            </Link>
          )
        }
      </div>
    </div>
  )
}

ZonesContainer.propTypes = {
  type: PropTypes.string,
  zones: PropTypes.array,
  subzones: PropTypes.array,
  viewStyle: PropTypes.string.isRequired,
  viewOrdering: PropTypes.string,
  changeSitesView: PropTypes.func,
  site: PropTypes.object,
  subzone: PropTypes.object,
  zone: PropTypes.object,
  highlightedZone: PropTypes.string
}

export default ZonesContainer
