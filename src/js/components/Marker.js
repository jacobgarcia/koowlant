import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'
import { PieChart, Pie, Cell, Label, Text } from 'recharts'

import { substractReportValues, getStatus } from '../lib/specialFunctions'
import constants from '../lib/constants'

// const COLORS = {
//   alerts: '#ed2a20',
//   warnings: '#FFC511',
//   normal: '#50E3C2'
// }
//

function SiteMarker(props) {
  const reports = substractReportValues(props.reports)
  const alerts = reports.alarms.length
  let { status } = getStatus(reports)

  let sensors = []
  if (props.isSite) {
    sensors = props.sensors.sensors
  }

  const position = [parseFloat(props.position[0], 10), parseFloat(props.position[1], 10)]

  return (
    <Marker
      position={position}
      onMouseOver={() => props.onMouseHover(props.site ? props.site._id : null)}
      onMouseOut={() => props.onMouseHover(null)}
      onClick={props.onClick}
      className="site-marker"
      icon={leafletIcon({
        iconUrl: '/static/img/icons/marker.svg',
        iconSize: [40, 40],
        // shadowSize: [40, 40],
        iconAnchor: [20, 40],
        // shadowAnchor: [20, 40],
        popupAnchor: [40, 0]
      })}>
      <Tooltip permanent opacity={1}>
        <div className={`tooltip site ${(props.isHighlighted && !props.deactivated) ? 'active' : ''}`}>
          <div className="content">
            <div className={`general`}>
              <div className="icons">
                { alerts > 0 ? <span className="alerts-icon" /> : null }
              </div>
              <h3>{props.title || props.site.name || props.site.key}</h3>
            </div>
            <div className="hidable sensors">
              {
                (status && props.isHighlighted === true && sensors)
                &&
                sensors.map((sensor, index) => {
                  status = [{ name: 'normal', value: sensor.value}, { name: 'alerts', value: 100 - sensor.value }]
                  const percentage = sensor.value

                  return (
                    <div className="sensor" key={index}>
                      <PieChart width={35} height={35}>
                        <Pie
                          dataKey="value"
                          data={status}
                          outerRadius={17}
                          innerRadius={12}
                          startAngle={-45}
                          endAngle={225}
                          fill=""
                          animationEase="ease"
                          animationDuration={300}
                          animationBegin={0}
                        >
                        <Cell fill={constants.colors(percentage)} />
                        <Cell fill="#e3e3e3" />
                        </Pie>
                      </PieChart>
                      <p>{sensor.key}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          {/* <span className="hidable">{getStatus(status).normalPercentage * 100}%</span> */}
        </div>
      </Tooltip>
    </Marker>
  )
}

SiteMarker.propTypes = {
  position: PropTypes.array,
  deactivated: PropTypes.bool,
  site: PropTypes.object,
  onMouseHover: PropTypes.func,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
  reports: PropTypes.array,
  title: PropTypes.string
}

SiteMarker.defaultProps = {
  onMouseEvent: () => {},
  onMouseHover: () => {}
}

export default SiteMarker
