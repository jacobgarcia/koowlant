import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'

function colors(value) {
  if (value > 75) {
    return '#50E3C2'
  } else if (value < 40) {
    return '#ed2a20'
  }
  return '#FFC511'
}

function ElementStatus(props) {
  return (
      <div
        className="status list"
        onMouseOver={() => props.onHover(props.id)}
        onMouseOut={() => props.onHover(null)}
        >
        <div className="status-text">
          <span className="main">{props.title} {props.name} <span> {props.siteKey}</span></span>
          {props.type !== 'SITE' && <span>{props.elements} Subzonas</span>}
          <span>{props.alarms} Alarmas</span>
        </div>
        <div className="chart-container">
          <p>{props.percentage}%</p>
          <PieChart width={70} height={70}>
            <Pie
              dataKey="value"
              data={props.status}
              outerRadius={35}
              innerRadius={28}
              startAngle={props.type === 'SITE' ? -45 : -90}
              endAngle={props.type === 'SITE' ? 225 : 270}
              fill=""
              animationEase="ease"
              animationDuration={500}
              animationBegin={0}
              strokeWidth={0}
            >
            <Cell fill={colors(props.percentage)} />
            <Cell fill="#e3e3e3" />
            </Pie>
          </PieChart>
        </div>
      </div>

  )
}

export default ElementStatus
