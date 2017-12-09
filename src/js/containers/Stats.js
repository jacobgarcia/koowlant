import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { formatDate, parseDate } from 'react-day-picker'
import { connect } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts'

import { NetworkOperation } from '../lib'
import { intToRGB, hashCode } from '../lib/specialFunctions'

class Stats extends Component {
  constructor(props) {
    super(props)

    this.state = {
      from: undefined,
      to: undefined,
      selectedZones: [],
      data: [],
      alarms: [],
      showZoneSelector: false
    }

    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.getStats = this.getStats.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const { name, checked } = event.target
    const selectedZones = this.state.selectedZones

    if (name === 'ALL') {
      checked
      ?
      this.setState({
        selectedZones: this.props.zones.reduce((sum, {_id}) => [...sum, _id], [])
      })
      :
      this.setState({
        selectedZones: []
      })
      return
    }

    selectedZones.some(zoneId => zoneId === name)
    ?
    this.setState(prevState => ({
      selectedZones: prevState.selectedZones.filter(zoneId => zoneId !== name)
    }))
    :
    this.setState(prev => ({
      selectedZones: prev.selectedZones.concat([name])
    }))

  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  componentWillMount() {
    if (this.state.selectedZones.length === 0 && this.props.zones && this.props.zones.length > 0) {
      this.setState({
        selectedZones: this.props.zones.reduce((sum, {_id}) => [...sum, _id], [])
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selectedZones.length === 0 && nextProps.zones && nextProps.zones.length > 0) {
      this.setState({
        selectedZones: nextProps.zones.reduce((sum, {_id}) => [...sum, _id], [])
      })
    }
  }

  focusTo() {
    // Focus to `to` field. A timeout is required here because the overlays
    // already set timeouts to work well with input fields
    this.timeout = setTimeout(() => this.to.getInput().focus(), 0)
  }

  showFromMonth() {
    const { from, to } = this.state
    if (!from) {
      return
    }

    // if (moment(to).diff(moment(from), 'months') < 2) {
    //   this.to.getDayPicker().showMonth(from)
    // }
  }

  handleFromChange(from) {
    // Change the from date and focus the "to" input field
    this.setState({ from }, () => {
      if (!this.state.to) {
        this.focusTo()
      }
    })
  }

  handleToChange(to) {
    this.setState({ to }, this.showFromMonth)
  }

  getStats() {
    const from = this.state.from.toISOString()
    const to = this.state.to.toISOString()

    NetworkOperation.getGeneralStats(from, to)
    .then(({data}) => {
      this.setState({
        data: data.data
      })
    })
    .catch(error => {
      this.setState({
        data: null
      })
    })

    NetworkOperation.getGeneralAlarms(from, to)
    .then(({data}) => {
      this.setState({
        alarms: data.alarms
      })
    })
    .catch(error => {
      this.setState({
        data: null
      })
    })
  }

  render() {
    const { props, state } = this
    const { from, to } = state
    const modifiers = { start: from, end: to }

    return (
      <div className="app-content stats">
        <h3>Estadísticas</h3>
        <div className="actions">
          <div>
            <p>Comparar: </p>
            <div className="counter" onClick={() => this.setState(prev => ({ showZoneSelector: !prev.showZoneSelector }))}>
              <span className="value">{state.selectedZones.length}</span>
              <span className="title">Zonas</span>
              <ul className={`drop-list ${!state.showZoneSelector && 'hidden'}`} onClick={evt => evt.stopPropagation()}>
                <li>
                  <input
                    type="checkbox"
                    id="all"
                    name="ALL"
                    onChange={this.onChange}
                  />
                  <label htmlFor="all"><b>Todas</b></label>
                </li>
                {
                  props.zones.map(zone =>
                    <li key={zone._id}>
                      <input
                        type="checkbox"
                        id={zone._id}
                        name={zone._id}
                        onChange={this.onChange}
                        checked={this.state.selectedZones.some(zoneId => zoneId === zone._id)}
                      />
                      <label htmlFor={zone._id}> {zone.name}</label>
                    </li>
                  )
                }
                {/* <input type="button" className="destructive" value="Aplicar"/> */}
              </ul>
            </div>
          </div>
          <div>
            <p>Periodo: </p>
            <div className="date-picker">
              <div className="InputFromTo">
                <DayPickerInput
                  value={from}
                  placeholder="Fecha inicio"
                  format="LL"
                  formatDate={formatDate}
                  parseDate={parseDate}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { after: to },
                    toMonth: to,
                    modifiers,
                    numberOfMonths: 2,
                  }}
                  onDayChange={this.handleFromChange}
                />{' '}
                —{' '}
                <span className="InputFromTo-to">
                  <DayPickerInput
                    ref={el => (this.to = el)}
                    value={to}
                    placeholder="Fecha fin"
                    format="LL"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                      selectedDays: [from, { from, to }],
                      disabledDays: { before: from },
                      modifiers,
                      month: from,
                      fromMonth: from,
                      numberOfMonths: 2,
                    }}
                    onDayChange={this.handleToChange}
                  />
                </span>
                <input type="button" className="destructive" value="Aplicar" onClick={this.getStats}/>
              </div>
            </div>
          </div>
          <div>
            <button>Generar reporte</button>
          </div>
        </div>
        <h4>Estatus</h4>
        <div className="chart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart width={600} height={300} data={state.data}
              syncId="stats"
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis axisLine={false} dataKey="name" />
             <YAxis axisLine={false} domain={[0,100]} tickFormatter={value => value + '%'} />
             <CartesianGrid vertical={false} stroke="#dfdfdf" />
             <Tooltip/>
             <Legend />
             {
               props.zones &&
               props.zones.filter(({_id: zoneId}) => state.selectedZones.some(_id => _id === zoneId)).map(zone =>
                 <Line
                   key={zone._id}
                   type="monotone"
                   dataKey={zone._id}
                   stroke={`#${intToRGB(hashCode(zone._id))}`}
                   name={zone.name}
                 />
               )
             }
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* <h4>Sitios con mas alertas</h4>
        <div className="actions">
        </div>
        <div className="chart"></div> */}
        <h4>Alertas</h4>
        <div className="actions"></div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={state.alarms}
              maxBarSize={50}
              syncId="stats"
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis axisLine={false} dataKey="name" />
             <YAxis axisLine={false} domain={[0,100]} tickFormatter={value => value + '%'} />
             <CartesianGrid vertical={false} stroke="#dfdfdf" />
             <Tooltip/>
             <Legend />
             {
               props.zones &&
               props.zones.filter(({_id: zoneId}) => state.selectedZones.some(_id => _id === zoneId)).map(zone =>
                 <Bar
                   key={zone._id}
                   stackId="alarms"
                   dataKey={zone._id}
                   fill={`#${intToRGB(hashCode(zone._id))}`}
                   name={zone.name}
                 />
               )
             }
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}

function mapStateToProps({zones, credentials}) {
  return {
    zones: zones.map(({name, _id, subzones}) => ({name, _id, subzones: subzones.map(({_id, name}) => ({_id, name}))}))
  }
}

export default connect(mapStateToProps)(Stats)
