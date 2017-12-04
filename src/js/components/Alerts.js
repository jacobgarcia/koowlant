import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NetworkOperation } from '../lib'

class Alerts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerts: {
        today: [],
        before: []
      }
    }
  }

  componentDidMount() {
    NetworkOperation.getPreviousAlarms(50)
    .then(({data}) => {

    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.alerts.length === nextProps.alerts.length) return

    const today = new Date().getDay()
    const alerts = {
      today: [],
      before: []
    }

    this.props.alarms.map(alert => {
      alert.alarms.map(({timestamp, values}) => {
        if (new Date(timestamp).getDay() === today) {
          alerts.today = alerts.today.concat([{timestamp, ...alert}])
        } else {
          alerts.before = alerts.before.concat([{timestamp, ...alert}])
        }
      })
    })

    this.setState({
      alerts
    })
  }

  render() {
    const { state, props } = this
    const today = new Date().getDay()

    console.log('PROPS', this.props.alarms)

    const todayReports = props.alarms.reduce((sum, alarm) => {
      const alarms = alarm.alarms.filter(({timestamp}) => new Date(timestamp).getDay() === today)
      .reduce((sum, {values = [], attended, timestamp}) => [...sum, ...values.map(value => ({...value, timestamp, attended }))], [])
      return [...sum, ...alarms]
    }, [])

    const erlierReports = props.alarms.reduce((sum, alarm) => {
      const alarms = alarm.alarms.filter(({timestamp}) => new Date(timestamp).getDay() !== today)
      .reduce((sum, {values = [], attended, timestamp}) => [...sum, ...values.map(value => ({...value, timestamp, attended }))], [])
      return [...sum, ...alarms]
    }, [])

    return (
      <div className={`alerts ${!props.isVisible && 'hidden'}`}>
        <div className="content">
          <div className={`tooltip ${props.isCreating && 'hidden'}`} onClick={props.onVisibleToggle}/>
          <div className="mini-header">
            <span className="pop-window">Hacer ventana</span>
          </div>
          <div className="alerts-container">
            <h4>Activas</h4>
            {
              props.alarms.map((siteAlarms, siteAlarmsIndex) => {
                if (!siteAlarms.alarms || !siteAlarms.alarms.length || !siteAlarms.alarms[0].values.length) return null

                return (
                  <div className="site-container" key={siteAlarmsIndex}>
                    {
                      siteAlarms.alarms[0].values.map((value, index) =>
                        <div className="alert" key={index}>
                          <div className="icon"></div>
                          <div>
                            <p>{value.key} {value.value}</p>
                            <span className="location">Zona {siteAlarms.zone.name}, {siteAlarms.subzone.name}, {siteAlarms.site.key}</span>
                          </div>
                          <p className="date">{new Date(siteAlarms.alarms[0].timestamp).toLocaleString('es-MX')}</p>
                        </div>
                      )
                    }
                  </div>
                )
              })
            }
            <h4>Anteriores</h4>
            {
              props.alarms.map((siteAlarms, siteAlarmsIndex) => {
                if (!siteAlarms.alarms || !siteAlarms.alarms.length || !siteAlarms.alarms[0].values.length) return null

                return (
                  <div className="site-container" key={siteAlarmsIndex}>
                    {
                      siteAlarms.alarms.reduce((sum, alarms, index) => index === 0 ? [...sum] : [...sum, alarms.values], []).map((value, index) =>
                        <div className="alert" key={index}>
                          <div className="icon"></div>
                          <div>
                            <p>{value[0].key} {value[0].value}</p>
                            <span className="location">Zona {siteAlarms.zone.name}, {siteAlarms.subzone.name}, {siteAlarms.site.key}</span>
                          </div>
                          <p className="date">{new Date(siteAlarms.alarms[0].timestamp).toLocaleString('es-MX')}</p>
                        </div>
                      )
                    }
                  </div>
                )
              })
            }
          </div>
          <div>
            {
              state.alerts.today.map((alert, index) =>
                <p key={index}>{JSON.stringify(alert.timestamp)}</p>
              )
            }
            {
              state.alerts.before.map((alert, index) => {
                const date = new Date(alert.timestamp)

                return (
                  <div key={index}>
                    <span className="date">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

Alerts.defaultProps = {
  alerts: []
}

export default Alerts


// {
//   "site": {
//     "_id": "5a0b805dd6e4539441f79601",
//     "key": "23dTas2"
//   },
//   "zone": {
//     "_id": "5a0b3d43d357508658895c91",
//     "name": "Centro"
//   },
//   "subzone": {
//     "_id": "5a0b3d55d357508658895c92",
//     "name": "Valle de México"
//   },
//   "alarms": [
//     {
//       "timestamp": 1511253451562,
//       "values": [
//         {
//           "key": "ts3",
//           "value": 90,
//           "_id": "5a13e5cbfd09dd3b94505b92"
//         }
//       ],
//       "attended": false
//     }
//   ],
//   "sensors": [
//     {
//       "timestamp": 1511253451562,
//       "values": [
//         {
//           "key": "ts1",
//           "value": 1.8,
//           "_id": "5a13e5cbfd09dd3b94505b91"
//         }, {
//           "key": "ts2",
//           "value": 41.8,
//           "_id": "5a13e5cbfd09dd3b94505b90"
//         }, {
//           "key": "ts3",
//           "value": 60.8,
//           "_id": "5a13e5cbfd09dd3b94505b8f"
//         }
//       ]
//     }
//   ]
// }
