import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {StatusBar} from './'

class StatusOverall extends PureComponent {
  render() {
    const props = this.props
    const getTitle = (type, props) => {
      switch (type) {
        case 'zone': return 'Zona ' + props.zone.name
        case 'subzone': return 'Subzona ' + props.zone.name
        case 'site': return 'Sitio ' + (props.site ? props.site.name || props.site.key : '')
        default: return 'Estatus General'
      }
    }

    return (
      <div className="overall">
        <h3>{getTitle(props.type, props)}<span>{props.site && (props.site.key || props.site._id)}</span></h3>
        <div className="sites-status">
          <StatusBar status={props.status}/>

          {
            props.alarms
            &&
            (props.alarms.length > 0)
            ? <p><span>{props.percentage || '?'}%</span> de funcionalidad. <span className="alert"></span> {props.alarms && props.alarms.length} Alarmas totales</p>
            : <p><span>{props.percentage || '?'}%</span> de funcionalidad. Ninguna falla presente.</p>
          }

        </div>
      </div>
    )
  }
}

StatusOverall.propTypes = {
  type: PropTypes.string.isRequired,
  zone: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  alarms: PropTypes.array,
  site: PropTypes.object,
  status: PropTypes.array,
  percentage: PropTypes.number
}

export default StatusOverall
