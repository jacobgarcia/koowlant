import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'

function SiteMarker(props) {
  return (
    <Marker
      position={props.position}
      icon={leafletIcon({
        iconUrl: '/static/img/icons/marker.png',
        iconSize: [40, 40], // size of the icon
        shadowSize: [40, 40], // size of the shadow
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
        shadowAnchor: [20, 40], // the same for the shadow
        // popupAnchor: [-3, -76]
      })}>
      <Tooltip permanent opacity={1}>
        <h3>Torre {props.title}</h3>
      </Tooltip>
    </Marker>
  )
}

SiteMarker.propTypes = {
  position: PropTypes.array,
  title: PropTypes.string
}

export default SiteMarker
