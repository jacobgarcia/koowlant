import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NetworkOperation } from '../lib'
import { getSensorName, getSensorUnits } from '../lib/specialFunctions'

class Alerts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerts: {
        today: [],
        before: []
      },
      presentingAlarms: [],
      alarmsCount: 0
    }

    this.onSecond = this.onSecond.bind(this)
  }

  componentDidMount() {
    // TODO get last alerts
    this.interval = setInterval(() => this.onSecond(), 4000)
  }

  onSecond() {
    if (this.state.presentingAlarms.length < 1) return
    this.setState(prev => ({
      presentingAlarms: prev.presentingAlarms.map((alarm, index) => index === (prev.presentingAlarms.length - 1) ? ({...alarm, dismissed: true}) : alarm)
    }), () => {
      setTimeout(() => {
        this.setState(prev => ({
          presentingAlarms: prev.presentingAlarms.slice(0, prev.presentingAlarms.length - 1)
        }))
      }, 500)
    })
  }

//   shouldComponentUpdate(nextProps, {isVisible, isCreating, alarmsCount = 0}) {
//     if (props.isVisible) return true
// props.isCreating) return false
//     if (this.state.alarmsCount !== alarmsCount) return true
//     return true
//   }

  componentWillReceiveProps(nextProps) {
    const alarms =
    nextProps.alarms.reduce((sum, {zone, subzone, site, alarms = []}) =>
      [...alarms.reduce((sum, {values = [], timestamp}) =>
        [...values.map(value => ({...value, timestamp: new Date(timestamp).getTime(), zone, subzone, site})), ...sum],
        []),
      ...sum]
    , [])

    alarms.sort(({timestamp: a}, {timestamp: b}) => b - a)

    if (this.state.alarmsCount === alarms.length) return

    const alarmsDelta = alarms.length - this.state.alarmsCount

    for (let index = 0; index < alarmsDelta; index += 1) {
      this.setState(prev => ({
        presentingAlarms: prev.presentingAlarms.concat([alarms[index]])
      }))
    }

    const today = new Date().getDay()
    const alerts = {
      today: [],
      before: []
    }

    nextProps.alarms.map(alert => {
      alert.alarms.map(({timestamp}) => {
        if (new Date(timestamp).getDay() === today) {
          alerts.today = alerts.today.concat([{timestamp, ...alert}])
        } else {
          alerts.before = alerts.before.concat([{timestamp, ...alert}])
        }
      })
    })

    this.setState({
      alerts,
      alarmsCount: alarms.length
    })
  }

  render() {
    const { state, props } = this

    return (
      <div className={`alerts ${!props.isVisible && 'hidden'}`}>
        <div className="floating-alerts-container">
          <div className="floating-alerts">
            {
              state.presentingAlarms.sort(({timestamp: a}, {timestamp: b}) => b - a).map((alarm, index) =>
                <div key={index + alarm._id + alarm.timestamp + alarm.site + alarm.value}
                  className={`alarm ${alarm.dismissed && 'dismissed'} ${alarm.key.length > 0 && alarm.key[0]}`}
                  style={{transitionDelay: `${index / 20}s`}}
                  >
                  <div className="text">
                    <span className="title">{getSensorName(alarm.key)}</span>
                    <span className="value">{alarm.value}{getSensorUnits(alarm.key)}</span>
                  </div>
                  {/* <span>{index + alarm._id + alarm.timestamp}</span> */}
                  <span className="location">{alarm.zone && alarm.zone.name}, {alarm.subzone && alarm.subzone.name}, {alarm.site && alarm.site.name}</span>
                </div>
              )
            }
          </div>
        </div>
        <div className="content">
          <div className={`tooltip ${props.isCreating && 'hidden'} ${Boolean(state.alarmsCount) && 'active'}`} onClick={props.onVisibleToggle}/>
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
                        <div className={`alert ${value.key.length > 0 && value.key[0]}`} key={index}>
                          <div>
                            <p>{getSensorName(value.key)} {value.value}{getSensorUnits(value.key)}</p>
                            <span className="location">Zona {siteAlarms.zone.name}, {siteAlarms.subzone.name}, {siteAlarms.site.name}</span>
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
                            <p>{value.length > 0 && value[0].key} {value.length > 0 && value[0].value}</p>
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
        </div>
      </div>
    )
  }
}

Alerts.defaultProps = {
  alerts: []
}

Alerts.propTypes = {
  alarms: PropTypes.array
}

export default Alerts
