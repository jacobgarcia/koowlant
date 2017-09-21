import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell } from 'recharts'

import { getData, getStatus, getSensorChart } from '../SpecialFunctions'

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

function MiniZone(props) {
  const data = getData(props.zone)
  let { status, percentage } = getStatus(data)

  // console.log('MINI ZONE', props.zone, status, percentage)

  if (!status && props.type === 'site') {
    status = getSensorChart('TEMPERATURE')
  }

  let numberSites = props.zone.subzones ? (props.zone.subzones.reduce((sum, subzone) => sum + (subzone.sites ? subzone.sites.length : 0), 0)) : 0
  numberSites += props.zone.sites ? props.zone.sites.length : 0

  const getTitle = (type, {name, _id}) => {
    switch (type) {
      case 'general': return 'Zona ' + name
      case 'zone': return 'Subzona ' + name
      case 'subzone': return 'Sitio ' + (name || _id)
      case 'site': return 'Sensor ' + (name || _id)
      default: return 'Indefinido'
    }
  }

  return (
    <div className={`mini-zone ${props.active ? 'active' : ''}`} onMouseEnter={() => props.onHover(props.id)} onMouseLeave={() => props.onHover(null)}>
      <div className="status-text">
        <div className="status-color" style={{ background: COLORS.normal }}></div>
        <h3>{getTitle(props.type, props.zone)} </h3>
        <div className="count">
          { props.zone.sites ? <p className="sites">{numberSites} Sitios</p> : null }
          { props.zone.subzones ? <p className="subzones">{props.zone.subzones.length} Subzonas</p> : null }
          {/* { <p className="admin">0 Administradores</p> } */}
        </div>
        <div className="reports-count">
          {
            (
              (data && data.alarms && data.alarms.length > 0) && <p><span className="alerts-icon"/>{data.alarms.length} Alarmas</p>
            )
            || <p className="no-failures"><span className="no-failures-icon" /> Sin fallas</p>
          }
          {/* { props.zone.warnings && <p><span className="warnings-icon"/>{props.zone.warnings.length} Posibles fallas</p> } */}
        </div>
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
          status
          && <div className="graph">
              <PieChart width={70} height={70}>
                <Pie
                  dataKey="value"
                  data={status}
                  outerRadius={35}
                  innerRadius={28}
                  startAngle={props.type === 'site' ? -45 : 90}
                  endAngle={props.type === 'site' ? 225 : -270}
                  fill=""
                  isAnimationActive={false}
                >
                { status.map((status, index) => <Cell key={index} fill={COLORS[status.name]} />) }
                </Pie>
              </PieChart>
              {
                props.type === 'site'
                ? <span className="percentage">{props.zone.value}°</span>
                : <span className="percentage">{percentage}%</span>
              }
            </div>
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
  zone: PropTypes.object,
  type: PropTypes.string
}

export default MiniZone
