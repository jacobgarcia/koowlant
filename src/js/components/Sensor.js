import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

class Sensor extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.sensor.value === this.props.sensor.value) {
      return false
    }
    return true
  }

  getSensorChart(code, value) {
    if (code.length < 3) return null
    switch (code.charAt(0)) {
      case 't': {
        const maxTemperature = 100
        return (
          <div>
            <BarChart
              width={30}
              height={70}
              data={[{ name: 'val', value, rest: maxTemperature - value }]}
              style={{borderRadius: 10}}
            >
              <Bar
                dataKey="value"
                fill={(() => {
                  const minimum = 0
                  const ratio = 2 * (value - minimum) / (maxTemperature - minimum)
                  const blue = Number.parseInt(Math.max(0, 255 * (1 - ratio)), 10)
                  const red = Number.parseInt(Math.max(0, 255 * (ratio - 1)), 10)
                  const green = 255 - blue - red
                  var rgb = blue | (green << 8) | (red << 16)
                  return '#' + (0x1000000 + rgb).toString(16).slice(1)
                })()}
                stackId="a"
              />
              <Bar
                dataKey="rest"
                fill="#b1b1b1"
                stackId="a"
              />
            </BarChart>
            <p><span>{this.props.sensor.value}°</span></p>
          </div>
        )
      }
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
              startAngle={-90}
              endAngle={450}
              fill=""
              animationEase="ease"
              animationDuration={500}
              animationBegin={0}
              strokeWidth={0}
            >
            <Cell fill={'#50E3C2'} />
            <Cell fill={'#ed2a20'} />
            </Pie>
          </PieChart>
          <span className="percentage">{Math.round(this.props.sensor.value)}%</span>
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
