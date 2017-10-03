import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'
import { PieChart, Pie, Cell } from 'recharts'

import { substractReportValues } from '../SpecialFunctions'

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

function SiteMarker(props) {
  let status
  const reports = substractReportValues(props.reports)
  const alerts = reports.alarms.length

  return (
    <Marker
      position={props.position}
      onMouseOver={() => props.onMouseEvent(props.site ? props.site._id : null)}
      onMouseOut={() => props.onMouseEvent(null)}
      onClick={props.onClick}
      icon={leafletIcon({
        iconUrl: '/static/img/icons/marker.svg',
        iconSize: [40, 40],
        shadowSize: [40, 40],
        iconAnchor: [20, 40],
        shadowAnchor: [20, 40],
      })}>
      <Tooltip permanent opacity={1} >
        <div className={`tooltip ${(props.highlightedZone === props.site._id && !props.deactivated) ? 'active' : ''}`}>
          <div className={`general`}>
            <div className="icons">
              {/* { warnings > 0 ? <span className="warnings-icon" /> : null } */}
              { alerts > 0 ? <span className="alerts-icon" /> : null }
            </div>
            <h3>{props.site.name || props.site.key}</h3>
          </div>
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
  deactivated: PropTypes.bool,
  site: PropTypes.object,
  onMouseEvent: PropTypes.func,
  highlightedZone: PropTypes.string,
  onClick: PropTypes.func,
  reports: PropTypes.array
}

SiteMarker.defaultProps = {
  onMouseEvent: () => {}
}

export default SiteMarker
