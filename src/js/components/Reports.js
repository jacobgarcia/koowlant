import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Reports extends Component {
  constructor(props) {
    super(props)
    // let currentAlarm

    // if (alarms.length > 0) {
    //   currentAlarm = alarms[alarms.length - 1]
    // }

    this.state = {
      reports: [],
      isAlertHidden: true,
      alarm: {}
    }
  }

  componentWillReceiveProps() {
    const reports = this.props.reports.reduce((sum, element) => {
      let alarms = element.alarms
      alarms = alarms.map(alarm => ({...alarm, zone: element.zone, subzone: element.subzone, site: element.site}))
      return [...alarms, ...sum]
    }, [])
    .filter(report => report.values.length > 0)
    .sort((a, b) => b.timestamp - a.timestamp)

    if (this.state.reports.length !== reports.length) {
      this.showAlarm(reports[0])
      this.setState({
        reports
      })
    }
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

  render() {
    const props = this.props

    const notChecked = this.state.reports.filter(report => report.attended === false)
    .reduce((sum, element) => sum + element.values.length, 0)

    return (
      <div className={`alerts ${props.isAlertsHidden ? 'hidden' : 'active'}`}>
        {/* <Link to={`/zones/${this.state.alarm.zone ? this.state.alarm.zone._id : null}/${this.state.alarm.subzone ? this.state.alarm.subzone._id : null}/${this.state.alarm.site ? this.state.alarm.site._id : null}`}> */}
          <div
            className={`alert-thumbnail ${this.state.isAlertHidden ? 'hidden' : 'active'}`}
            onClick={props.onHide}>
            <div className="content">
              <p className="alert-description">Batería baja</p>
              {
                (this.state.alarm && this.state.alarm.zone) &&
                <p className="location">Zona {this.state.alarm.zone.name} | Subzona {this.state.alarm.subzone.name} | Sitio {this.state.alarm.site}</p>
              }
            </div>
          </div>
        {/* </Link> */}
        <input
          type="button"
          onClick={props.onHide}
          className="close-tab alerts-side"
        />
        <div className="side-content">
          { props.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
          <div className="general-alerts">
            <h2>Alertas</h2>
            <span>{notChecked} sin revisar</span>
          </div>
          <div className="mini-alerts-container">
              {
                this.state.reports.map((report, index) => {
                  const date = new Date(report.timestamp)
                  return (
                    report.values.map((value, index2) =>
                      <Link to={`/zones/${report.zone ? report.zone._id : null}/${report.subzone ? report.subzone._id : null}`}
                        key={`${index2}${report.timestamp}${index}`}>
                        <div className="mini-alert battery">
                          <div className="details">
                            <div><span>Zona {report.zone.name} | Sitio {report.site}</span></div>
                            <p>Batería baja {value.value}%</p>
                          </div>
                          <div className="time">
                            <span>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                            <span>{`${date.getHours()}:${date.getMinutes()}`}</span>
                          </div>
                        </div>
                      </Link>
                    )
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

export default Reports
