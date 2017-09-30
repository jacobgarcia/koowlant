import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'
import { PieChart, Pie, Cell } from 'recharts'

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

function SiteMarker(props) {
  console.log(props.highlightedZone)
  let status
  return (
    <Marker
      position={props.position}
      onMouseOver={() => props.onMouseEvent(props.site._id)}
      onMouseOut={() => props.onMouseEvent(null)}
      icon={leafletIcon({
        iconUrl: '/static/img/icons/marker.svg',
        iconSize: [40, 40], // size of the icon
        shadowSize: [40, 40], // size of the shadow
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
        shadowAnchor: [20, 40], // the same for the shadow
        // popupAnchor: [-3, -76]
      })}>
      <Tooltip permanent opacity={1} >
        <div className={`tooltip ${props.highlightedZone === props.site._id ? 'active' : ''}`}>
          <h3>Sitio {props.site.name || props.site.key}</h3>
          <div className="hidable">
            {
              status
              && <PieChart width={85} height={85}>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={42}
                  innerRadius={34}
                  startAngle={90}
                  endAngle={-270}
                  fill=""
                  animationEase="ease"
                  animationDuration={501}
                  animationBegin={0}
                >
                { status.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
              </PieChart>
            }
          </div>
          {/* <span className="hidable">{getStatus(status).normalPercentage * 100}%</span> */}
        </div>
      </Tooltip>
    </Marker>
  )
}

SiteMarker.propTypes = {
  position: PropTypes.array,
  title: PropTypes.string,
  site: PropTypes.object
}

export default SiteMarker
