import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'
import { PieChart, Pie, Cell, Label, Text } from 'recharts'

import { substractReportValues, getStatus } from '../SpecialFunctions'

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

function SiteMarker(props) {
  let status

  const reports = substractReportValues(props.reports)
  const alerts = reports.alarms.length
  status = getStatus(reports).status

  

  return (
    <Marker
      position={props.position}
      onMouseOver={() => props.onMouseEvent(props.site ? props.site._id : null)}
      onMouseOut={() => props.onMouseEvent(null)}
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
          {
            props.isHighlighted === false
            &&
            <div className={`general`}>
              <div className="icons">
                {/* { warnings > 0 ? <span className="warnings-icon" /> : null } */}
                { alerts > 0 ? <span className="alerts-icon" /> : null }
              </div>
              <h3>{props.site.name || props.site.key}</h3>
            </div>
          }
          <div className="hidable">
            {
              status
              && <PieChart width={135} height={138}>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={21}
                  innerRadius={17}
                  startAngle={-45}
                  endAngle={225}
                  fill=""
                  animationEase="ease"
                  animationDuration={501}
                  animationBegin={0}
                  paddingAngle={0}
                  cx={28}
                  cy={21}
                  strokeWidth={0}
                  title="Temperatura"
                >
                  <Label value="Temperatura I" position="insideBottom" offset={54} />
                  { status.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={21}
                  innerRadius={17}
                  startAngle={-45}
                  endAngle={225}
                  fill=""
                  animationEase="ease"
                  animationDuration={501}
                  animationBegin={0}
                  paddingAngle={0}
                  cx={100}
                  cy={21}
                  strokeWidth={0}
                >
                  <Label value="Temperatura II" position="insideBottom" offset={54} />
                  { status.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={21}
                  innerRadius={17}
                  startAngle={-45}
                  endAngle={225}
                  fill=""
                  animationEase="ease"
                  animationDuration={501}
                  animationBegin={0}
                  paddingAngle={0}
                  cx={28}
                  cy={92}
                  strokeWidth={0}
                >
                  <Label value="Batería I" position="insideBottom" offset={54} />
                  { status.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={21}
                  innerRadius={17}
                  startAngle={-45}
                  endAngle={225}
                  fill=""
                  animationEase="ease"
                  animationDuration={501}
                  animationBegin={0}
                  paddingAngle={0}
                  cx={100}
                  cy={92}
                  strokeWidth={0}
                >
                  <Label value="Combustible I" position="insideBottom" offset={54} />
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
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
  reports: PropTypes.array
}

SiteMarker.defaultProps = {
  onMouseEvent: () => {}
}

export default SiteMarker
