import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { setAlarmAttended } from '../actions'

class Reports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reports: [],
      isAlertHidden: true,
      alarm: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    const reports = nextProps.reports.reduce((sum, report) => {
      const alarms = report.alarms.map(alarm => ({...alarm, zone: report.zone, subzone: report.subzone, site: report.site}))
      return [...alarms, ...sum]
    }, [])
    .filter(alarm => alarm.values.length > 0)
    .sort((alertA, alertB) => alertB.timestamp - alertA.timestamp)

    if (this.state.reports.length !== reports.length) {
      this.showAlarm(reports[0])
    }
    this.setState({
      reports
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.reports.length !== this.state.reports.length) return true
    if (nextState.isAlertHidden !== this.state.isAlertHidden) return true
    if (nextState.alarm !== this.state.alarm) return true
    if (nextProps.isAlertsHidden !== this.props.isAlertsHidden) return true
    return false
  }

  showAlarm(alarm) {
    this.setState({
      isAlertHidden: false,
      alarm
    }, () => {
      setTimeout(() => {
        this.setState({
          isAlertHidden: true
        })
      }, 5000)
    })
  }

  getAlertBody(code = 'none') {
    if (code.length < 3) return [null, null]
    switch (code.charAt(0)) {
      case 't': return ['Temperatura alta', 'temperature']
      case 'c': return ['Batería baja', 'battery']
      case 'f': return ['Combustible bajo', 'fuel']
      default: return [null, null]
    }
  }

  render() {
    const props = this.props

    const notChecked = this.state.reports.filter(report => report.attended === false)
    .reduce((sum, element) => sum + element.values.length, 0)

    const alertBody = this.getAlertBody(this.state.alarm && this.state.alarm.values && this.state.alarm.values.length && this.state.alarm.values[0] && this.state.alarm.values[0].key)

    return (
      <div className={`alerts ${props.isAlertsHidden ? 'hidden' : 'active'}`}>
        {/* <Link to={`/zones/${this.state.alarm.zone ? this.state.alarm.zone._id : null}/${this.state.alarm.subzone ? this.state.alarm.subzone._id : null}/${this.state.alarm.site ? this.state.alarm.site._id : null}`}> */}
          <div
            className={`alert-thumbnail ${this.state.isAlertHidden ? 'hidden' : 'active'}`}
            style={{backgroundImage: `url(/static/img/icons/${alertBody[1]}.svg)`}}
            onClick={props.onHide}>
            <div className="content">
              <p className="alert-description">{alertBody[0]}</p>
              {
                (this.state.alarm && this.state.alarm.zone) &&
                <p className="location">Zona {this.state.alarm.zone.name} | Subzona {this.state.alarm.subzone.name} | Sitio {this.state.alarm.site.key}</p>
              }
            </div>
          </div>
        {/* </Link> */}
        <input
          type="button"
          onClick={props.onHide}
          className={`close-tab alerts-side ${notChecked > 0 ? 'active' : ''}`}
        />
        <div className="side-content">
          { props.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
          <div className="general-alerts">
            <h2>Alertas</h2>
            {notChecked > 0 && <span>{notChecked} sin revisar</span>}
          </div>
          <div className="mini-alerts-container">
              {
                this.state.reports.map((report, index) => {
                  const date = new Date(report.timestamp)
                  return (
                    report.values.map((value, index2) => {
                      const alertBody = this.getAlertBody(value && value.key)

                      return (<Link
                        onClick={() => props.setAlarmAttended(report)}
                        to={`/zones/${report.zone ? report.zone._id : null}/${report.subzone ? report.subzone._id : null}/${report.site ? report.site._id : null}`}
                        key={`${index2}${report.timestamp}${index}`}>
                        <div className={`mini-alert ${alertBody[1]} ${report.attended ? 'attended' : 'not-attended'}`}>
                          <div className="details">
                            <div><span>Zona {report.zone.name} | Sitio {report.site.key}</span></div>
                            <p>{alertBody[0]} {value.value}%</p>
                          </div>
                          <div className="time">
                            <span>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                            <span>{`${date.getHours()}:${date.getMinutes()}`}</span>
                          </div>
                        </div>
                      </Link>)
                    })
                  )
                })
              }
          </div>
        </div>
      </div>
    )
  }
}

Reports.propTypes = {
  isAlertsHidden: PropTypes.bool,
  onHide: PropTypes.func,
  isWindow: PropTypes.bool,
  reports: PropTypes.array
}

function mapDispatchToProps(dispatch) {
  return {
    setAlarmAttended: report => {
      dispatch(setAlarmAttended(report))
    }
  }
}

export default connect(null, mapDispatchToProps)(Reports)
