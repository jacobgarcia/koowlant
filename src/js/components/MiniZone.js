import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell } from 'recharts'

import { hashCode, intToRGB, getStatus } from '../SpecialFunctions'

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

function MiniZone(props) {

  const { completeStatus, normalPercentage } = getStatus(props.zone.status)

  return (
    <div className={`mini-zone ${props.active ? 'active' : ''}`} onMouseEnter={() => props.onHover(props.id)} onMouseLeave={() => props.onHover(null)}>
      <div className="status-text">
        <div className="status-color" style={{ background: '#' + intToRGB(hashCode(props.name)) }}></div>
        <h3>{props.isZone ? 'Subzona' : props.isSite ? 'Sitio' : 'Zona'} {props.name}</h3>
        { props.zone.subzones ? <p>{props.zone.subzones.length} Sub-zonas</p> : null }
        { props.zone.sites ? <p>{props.zone.sites.length} torres</p> : null }
        { props.zone.admin ? <p>{props.zone.admins.length} admin</p> : null}
      </div>
      <div className="status-graph">
        {/* <div>
          {
            props.reports && props.reports.alerts && props.reports.alert.length > 0
              ? <p className="alert mini-icon"><span>{props.reports.alerts.length}</span> Alertas</p>
              : null
          }
          {
            props.reports && props.reports.warnings && props.reports.warnings.length > 0
            ? <p className="warning mini-icon"><span>{props.reports.warnings.length}</span> Precauciones</p>
            : null
          }
        </div> */}
        {
          props.zone.status
          ? <div className="graph">
              <PieChart width={70} height={70}>
                <Pie
                  dataKey="value"
                  data={completeStatus}
                  outerRadius={35}
                  innerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                  fill=""
                  isAnimationActive={false}
                >
                { completeStatus.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
              </PieChart>
              <span className="percentage">{normalPercentage}%</span>
            </div>
          : null
        }
      </div>
    </div>
  )
}

MiniZone.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  subzones: PropTypes.array,
  sites: PropTypes.array,
  admins: PropTypes.array,
  reports: PropTypes.array,
  onHover: PropTypes.func,
  active: PropTypes.bool,
  zone: PropTypes.object
}

export default MiniZone
