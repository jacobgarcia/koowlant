import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'
import PropTypes from 'prop-types'

const data = [
    {name: 'Page A', value: 60.5},
    {name: 'Page B', value: 40},
    {name: 'Page C', value: 44},
    {name: 'Page D', value: 55.5},
    {name: 'Page E', value: 30},
    {name: 'Page F', value: 32},
    {name: 'Page G', value: 41.2}
]

class Statistics extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="statistics">
        <h3>Estadísticas</h3>
        <div className="statistics-wrapper">
          {
            [0,0,1].map((value, index) =>
              <div className="statistic-box" key={index}>
                <div className="info">
                  <p><span>Temperatura</span> Zona A</p>
                </div>
                <LineChart width={450} height={200} data={data} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                  <YAxis/>
                  <CartesianGrid stroke="#ebebeb" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#50E3C2" activeDot={{
                      r: 8
                    }}/>
                </LineChart>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ reports, zones }) {
  return {
    reports,
    zones
  }
}

export default connect(mapStateToProps)(Statistics)
