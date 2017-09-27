import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getData } from '../SpecialFunctions'

class Reports extends Component {
  constructor(props) {
    super(props)

    const { alarms } = getData(props.zones)
    let currentAlarm

    if (alarms.length > 0) {
      currentAlarm = alarms[alarms.length - 1]
    }

    this.state = {
      currentAlarm
    }
  }

  componentWillReceiveProps(nextProps) {
    const { alarms } = getData(nextProps.zones)
    console.log('alarms', alarms)
    console.log(getData(nextProps.zones))
    if (alarms.length > 0) {
      const newAlarm = alarms[alarms.length - 1]
      console.log('New alarm', newAlarm)
      console.log(this.state.currentAlarm.timestamp, newAlarm.timestamp)
      if (this.state.currentAlarm.timestamp !== newAlarm.timestamp) {
        console.log('Setting new alarm', newAlarm)
        this.setState({
          currentAlarm: newAlarm
        })
      }
    }
  }

  showAlarm(alarm) {
    console.log('Alarm to be shown', alarm)
  }

  render() {
    const props = this.props

    return (
      <div className={`alerts ${props.isAlertsHidden ? 'hidden' : 'active'}`}>
        <input
          type="button"
          onClick={props.onHide}
          className="close-tab alerts-side"
        />
        <div className="side-content">
          { props.isWindow === 'zones' ? null : <span className="pop-window">Hacer ventana</span> }
          <div className="general-alerts">
            <h2>Alertas</h2>
            <span>4 sin revisar</span>
          </div>
          <div className="mini-alerts-container">

              <div className="mini-alert battery">
                <div className="details">
                  <div><span>Zona A Torre 5</span></div>
                  <p>Batería baja 18%</p>
                </div>
                <div className="time">
                  <span>23/05/2017</span>
                  <span>20:24</span>
                </div>
              </div>
              <div className="mini-alert temperature">
                <div className="details">
                  <div><span>Zona A Torre 5</span></div>
                  <p>Temperatura alta 70°</p>
                </div>
                <div className="time">
                  <span>23/05/2017</span>
                  <span>20:24</span>
                </div>
              </div>
              <div className="mini-alert fuel">
                <div className="details">
                  <div><span>Zona A Torre 5</span></div>
                  <p>Combustible bajo 15%</p>
                </div>
                <div className="time">
                  <span>23/05/2017</span>
                  <span>20:24</span>
                </div>
              </div>

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
