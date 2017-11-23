import React from 'react'
import PropTypes from 'prop-types'
import { Polygon, Tooltip} from 'react-leaflet'
import { PieChart, Pie, Cell } from 'recharts'

import { getStatus, substractReportValues } from '../lib/specialFunctions'

function colors(value) {
  if (value > 75) {
    return '#50E3C2'
  } else if (value < 40) {
    return '#ed2a20'
  }
  return '#FFC511'
}

function ZonePolygon(props) {
  const reports = substractReportValues(props.reports)

  const { status, percentage } = getStatus(reports || null)

  const alerts = reports.alarms.length

  return (
    <Polygon
      color="#666"
      fillColor="#fff"
      weight={1}
      positions={props.zone.positions || [[]]}
      fillOpacity={props.highlighted ? 0.7 : 0.4}
      onMouseOver={() => props.onMouseHover(props.zone._id)}
      onMouseOut={() => props.onMouseHover(null)}
      onClick={props.onClick}
      >
      <Tooltip
        permanent
        opacity={1}
      >
        <div className={`tooltip ${props.highlighted && 'active'}`}>
          <div className="content">
            <div className="hidable chart-container">
              <p>{percentage}%</p>
              {
                status
                &&
                <PieChart width={85} height={85}>
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
                  <Cell fill={colors(percentage)} />
                  <Cell fill="#e3e3e3" />
                  </Pie>
                </PieChart>
              }
            </div>
            <div className={`general`}>
              <div className="icons">
                {/* { warnings > 0 ? <span className="warnings-icon" /> : null } */}
                { alerts > 0 ? <span className="alerts-icon" /> : null }
              </div>
              <h3>{props.zone.name}</h3>
            </div>
          </div>
          {/* <span className="hidable">{getStatus(status).normalPercentage * 100}%</span> */}
        </div>
      </Tooltip>
    </Polygon>
  )
}

ZonePolygon.propTypes = {
  onMouseHover: PropTypes.func,
  highlighted: PropTypes.bool,
  zone: PropTypes.object.isRequired,
  reports: PropTypes.array,
  onClick: PropTypes.func
}

export default ZonePolygon
