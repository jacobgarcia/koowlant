import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell } from 'recharts'

function colors(value) {
  if (value > 75) {
    return '#50E3C2'
  } else if (value < 40) {
    return '#ed2a20'
  } else {
    return '#FFC511'
  }
}

class MiniZone extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (this.props.percentage !== nextProps.percentage) return true
    if (this.props.type !== nextProps.type) return true
    return false
  }

  render() {
    const props = this.props
    // const {  } =this.props
    const { status, reports, percentage } = this.props

    let numberSites = props.zone.subzones ? (props.zone.subzones.reduce((sum, subzone) => sum + (subzone.sites ? subzone.sites.length : 0), 0)) : 0
    numberSites += props.zone.sites ? props.zone.sites.length : 0

    const getTitle = (type, {name = '[sin nombre]', _id, key}) => {
      switch (type) {
        case 'general': return 'Zona ' + name
        case 'zone': return 'Subzona ' + name
        case 'subzone': return 'Sitio ' + name
        case 'site': return 'Sensor ' + (key || _id)
        default: return 'Indefinido'
      }
    }

    return (
      <div
        className={`mini-zone ${props.active ? 'active' : ''}`}
        onMouseEnter={() => props.onHover(props.id)}
        onMouseLeave={() => props.onHover(null)}
        style={{order: props.viewSort === 'DYNAMIC' ? percentage : 0}}
        >
        <div className="status-text">
          <div className="status-color" style={{ background: colors({value: 100}) }}></div>

          <h3>{getTitle(props.type, props)}<span>{props.type === 'subzone' && (props.zone.key || props._id)}</span></h3>
          <div className="count">
            { props.zone.sites ? <p className="sites">{numberSites} Sitios</p> : null }
            { props.zone.subzones ? <p className="subzones">{props.zone.subzones.length} Subzonas</p> : null }
            {/* { <p className="admin">0 Administradores</p> } */}
          </div>
          <div className="reports-count">
            {
              (
                (reports && reports.alarms && reports.alarms.length > 0)
                && <p className="reports-count-value"><span className="alerts-icon"/>{reports.alarms.length} Alarmas</p>
              )
              || <p className="no-failures"><span className="no-failures-icon" /> Sin fallas</p>
            }
          </div>
        </div>
        <div className="status-graph">
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
                    animationEase="ease"
                    animationDuration={500}
                    animationBegin={0}
                    strokeWidth={0}
                  >
                  <Cell fill={colors(percentage)} />
                  <Cell fill="#e3e3e3" />
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
}

MiniZone.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  subzones: PropTypes.array,
  sites: PropTypes.array,
  admins: PropTypes.array,
  // reports: PropTypes.array,
  onHover: PropTypes.func,
  active: PropTypes.bool,
  zone: PropTypes.object,
  type: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  status: PropTypes.array
}

MiniZone.defaultProps = {
  onHover: () => {}
}

export default MiniZone
