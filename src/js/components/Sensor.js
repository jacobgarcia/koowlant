import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

function colors(value) {
  if (value > 75) {
    return '#50E3C2'
  } else if (value < 40) {
    return '#ed2a20'
  } else {
    return '#FFC511'
  }
}

class Sensor extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.sensor.value === this.props.sensor.value) {
      return false
    }
    return true
  }

  getSensorChart(code, value) {
    if (code.length < 3) return null
    const sensorType = code.charAt(0)
    switch (sensorType) {
      case 't':
      case 'f':
      case 'c':
      return (
        <div className="chart">
          <PieChart width={70} height={70}>
            <Pie
              dataKey="value"
              data={[{ name: 'val', value},{ name: 'rest', value: 100 - value }]}
              outerRadius={35}
              innerRadius={28}
              startAngle={sensorType === 't' ? -45 : 90 }
              endAngle={sensorType === 't' ? 225 : -270 }
              fill=""
              animationEase="ease"
              animationDuration={500}
              animationBegin={0}
              strokeWidth={0}
            >
              <Cell fill={colors(this.props.sensor.value)} />
              <Cell fill="#e3e3e3" />
            </Pie>
          </PieChart>
          <span className="percentage">{Math.round(this.props.sensor.value)}{sensorType !== 't' ? '%' : '°'}</span>
        </div>
      )
      default:
      return null
    }
  }

  getSensorName(code) {
    if (code.length < 3) return null
    let name = ''
    switch (code.charAt(0)) {
      case 't':
      name += 'Temperatura'
      break
      case 'c':
      name += 'Batería'
      break
      case 'f':
      name += 'Combustible'
      break
      default:
      name += 'Sensor'
      break
    }
    name += ` ${code.charAt(2)}`
    return name
  }

  render() {
    return (
      <div className="sensor graph" style={this.props.viewSort === 'DYNAMIC' ? {order: Math.round(this.props.sensor.value * -1)} : {}}>
        <div>
          <h3>{this.getSensorName(this.props.sensor.key)}</h3>
          <p>{this.props.sensor.key}</p>
        </div>
        <div className="sensor-values graph">
          {
            this.getSensorChart(this.props.sensor.key, this.props.sensor.value)
          }
        </div>
      </div>
    )
  }
}

Sensor.propTypes = {
  viewSort: PropTypes.string,
  sensor: PropTypes.object
}

export default Sensor
