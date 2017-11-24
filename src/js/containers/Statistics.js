import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Area, CartesianGrid, ComposedChart, YAxis, XAxis, Tooltip, ResponsiveContainer, Line } from 'recharts'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'

const data = [
    {name: 'Page A', status: 60.5, temperature: 23.3, fuel: 87.3, charge: 91.42, humidity: 12.42},
    {name: 'Page B', status: 40, temperature: 39.3, fuel: 87.3, charge: 93.42, humidity: 12.42},
    {name: 'Page C', status: 44, temperature: 37.3, fuel: 87.3, charge: 96.42, humidity: 12.42},
    {name: 'Page D', status: 55.5, temperature: 23.3, fuel: 87.3, charge: 96.42, humidity: 12.42},
    {name: 'Page E', status: 30, temperature: 33.3, fuel: 87.3, charge: 86.42, humidity: 12.42},
    {name: 'Page F', status: 32, temperature: 21.3, fuel: 87.3, charge: 90.42, humidity: 12.42},
    {name: 'Page G', status: 41.3, temperature: 36.3, fuel: 87.32, charge: 93.42, humidity: 12.42},
    {name: 'Page A', status: 60.5, temperature: 23.3, fuel: 47.3, charge: 91.42, humidity: 12.42},
    {name: 'Page B', status: 40, temperature: 39.3, fuel: 37.3, charge: 93.42, humidity: 12.42},
    {name: 'Page C', status: 44, temperature: 37.3, fuel: 97.3, charge: 96.42, humidity: 12.42},
    {name: 'Page D', status: 55.5, temperature: 23.3, fuel: 87.3, charge: 96.42, humidity: 12.42},
    {name: 'Page E', status: 30, temperature: 33.3, fuel: 67.3, charge: 86.42, humidity: 12.42},
    {name: 'Page F', status: 32, temperature: 21.3, fuel: 77.3, charge: 90.42, humidity: 12.42},
    {name: 'Page G', status: 41.3, temperature: 36.3, fuel: 87.32, charge: 93.42, humidity: 12.42},
    {name: 'Page A', status: 60.5, temperature: 23.3, fuel: 100, charge: 91.42, humidity: 12.42},
    {name: 'Page B', status: 40, temperature: 39.3, fuel: 87.3, charge: 93.42, humidity: 12.42},
    {name: 'Page C', status: 44, temperature: 37.3, fuel: 87.3, charge: 96.42, humidity: 12.42},
    {name: 'Page D', status: 55.5, temperature: 23.3, fuel: 87.3, charge: 96.42, humidity: 12.42},
    {name: 'Page E', status: 30, temperature: 33.3, fuel: 87.3, charge: 86.42, humidity: 12.42},
    {name: 'Page F', status: 32, temperature: 21.3, fuel: 87.3, charge: 90.42, humidity: 12.42},
    {name: 'Page G', status: 41.3, temperature: 36.3, fuel: 87.32, charge: 93.42, humidity: 12.42},
]

class Statistics extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedFilter: null,
      isSelectingTo: false,
      isSelectingFrom: false,
      fromDate: '',
      toDate: '',
      selectedZone: null,
      selectedSubzone: null,
      selectedSensor: null
    }
  }

  render() {
    return (
      <div className="statistics">
        <div className="statistics-wrapper">
          <div className="statistic">
            <div className="view-settings">
              <div>
                <span className="selector-title">Periodo</span>
                <span className="selector" onClick={() => this.setState(prevState => ({selectedFilter: prevState.selectedFilter === 'PERIOD' ? null : 'PERIOD'}))}>
                  {
                    (this.state.fromDate || this.state.toDate)
                    ?
                    `${this.state.fromDate} - ${this.state.toDate}`
                    : 'Todo'
                  }
                  {
                    this.state.selectedFilter === 'PERIOD'
                    &&
                    <ul onClick={e => e.stopPropagation()}>
                      <input
                        className={`${this.state.isSelectingFrom && 'active'}`}
                        type="date"
                        onClick={() => this.setState({isSelectingFrom: true, isSelectingTo: false})}
                        placeholder="Fecha de inicio"
                        value={this.state.fromDate}
                        readOnly
                      />
                      <input
                        className={`${this.state.isSelectingTo && 'active'}`}
                        type="date"
                        onClick={() => this.setState({isSelectingTo: true, isSelectingFrom: false})}
                        placeholder="Fecha de fin"
                        value={this.state.toDate}
                        readOnly
                      />
                      {
                        (this.state.isSelectingFrom || this.state.isSelectingTo)
                        &&
                        <DayPicker
                          selectedDays={this.state.isSelectingFrom ? new Date(this.state.fromDate.split('/').reverse().join('/')) : new Date(this.state.toDate.split('/').reverse().join('/'))}
                          onDayClick={day => {
                          if (this.state.isSelectingFrom) return this.setState({fromDate: day.toLocaleDateString('es-MX')})
                          return this.setState({toDate: day.toLocaleDateString('es-MX')})
                        }}/>
                      }
                    </ul>
                  }
                </span>
              </div>
              <div className="zone-selector">
                <div>
                  <span className="selector-title">Zona</span>
                  <span className="selector" onClick={() => this.setState(prevState => ({selectedFilter: prevState.selectedFilter === 'ZONES' ? null : 'ZONES'}))}>
                    { this.state.selectedZone ? this.state.selectedZone.name : 'General'}
                    {
                      this.state.selectedFilter === 'ZONES'
                      &&
                      <ul onClick={() => {}}>
                        <li className={`${!this.state.selectedZone && 'selected'}`} onClick={() => this.setState({ selectedZone: null, selectedSubzone: null, selectedSite: null })}>General</li>
                        {
                          this.props.zones.map(zone =>
                            <li
                              key={zone._id}
                              className={`${this.state.selectedZone && this.state.selectedZone._id === zone._id && 'selected'}`}
                              onClick={() => this.setState({ selectedZone: {_id: zone._id, name: zone.name}, selectedSubzone: null, selectedSite: null })}>{zone.name}</li>
                          )
                        }
                      </ul>
                    }
                  </span>
                </div>
                  {
                    this.state.selectedZone
                    &&
                    <div>
                      <span className="selector-title">Subzona</span>
                      <span className="selector" onClick={() => this.setState(prevState => ({selectedFilter: prevState.selectedFilter === 'SUBZONES' ? null : 'SUBZONES'}))}>
                        { this.state.selectedSubzone ? this.state.selectedSubzone.name : 'Todas'}
                        {
                          this.state.selectedFilter === 'SUBZONES'
                          &&
                          <ul onClick={() => {}}>
                            <li className={`${!this.state.selectedSubzone && 'selected'}`}>Todas</li>
                            {
                              this.props.zones.filter(({_id}) => this.state.selectedZone._id === _id).length &&
                              this.props.zones.filter(({_id}) => this.state.selectedZone._id === _id)[0].subzones.map(subzone =>
                                <li
                                  key={subzone._id}
                                  className={`${this.state.selectedSubzone && this.state.selectedSubzone._id === subzone._id && 'selected'}`}
                                  onClick={() => this.setState({ selectedSubzone: subzone, selectedSite: null })}>{subzone.name}</li>
                              )
                            }
                          </ul>
                        }
                      </span>
                    </div>
                  }
                  {
                    this.state.selectedZone
                    &&
                    this.state.selectedSubzone
                    &&
                    <div>
                      <span className="selector-title">Sitio</span>
                      <span className="selector" onClick={() => this.setState(prevState => ({selectedFilter: prevState.selectedFilter === 'SITE' ? null : 'SITE'}))}>
                        { this.state.selectedSite ? (this.state.selectedSite.name || this.state.selectedSite.key) : 'Todos'}
                        {
                          this.state.selectedFilter === 'SITE'
                          &&
                          <ul onClick={() => {}}>
                            <li className={`${!this.state.selectedSite && 'selected'}`}>Todas</li>
                            {
                              this.state.selectedSubzone.sites
                              .map(site =>
                                <li
                                  key={site._id}
                                  className={`${this.state.selectedSite && this.state.selectedSite._id === site._id && 'selected'}`}
                                  onClick={() => this.setState({ selectedSite: {_id: site._id, name: site.name, key: site.key} })}>{site.name || site.key}</li>
                              )
                            }
                          </ul>
                        }
                      </span>
                    </div>
                  }
              </div>
              <div>
                <span className="selector-title">Sensores</span>
                <span className="selector" onClick={() => this.setState(prevState => ({selectedFilter: prevState.selectedFilter === 'SENSORS' ? null : 'SENSORS'}))}>
                  {
                    this.state.selectedSensor
                    ? this.state.selectedSensor.name
                    : 'Todos'
                  }
                  {
                    this.state.selectedFilter === 'SENSORS'
                    &&
                    <ul>
                      <li className={`${!this.state.selectedSensor && 'selected'}`}>Todas</li>
                      {
                        [
                          {name: 'Temperatura', key: 'TEM'},
                          {name: 'Combustible', key: 'FUE'},
                          {name: 'Carga', key: 'BAT'},
                          {name: 'Humedad', key: 'HUM'},
                          {name: 'Status', key: 'STA'},
                        ].map(sensor =>
                          <li
                            className={`${this.state.selectedSensor && this.state.selectedSensor.key === sensor.key && 'selected'}`}
                            onClick={() => this.setState({ selectedSensor: sensor})}
                            key={sensor.key}>{sensor.name}</li>
                        )
                      }
                    </ul>
                  }
                </span>
              </div>
            </div>
            <div className="box">
              <div className="info">
                <div>
                  <span>Status promedio</span>
                  <p>96.5%</p>
                </div>
                <div>
                  <span>Total de alertas</span>
                  <p>7 Zonas</p>
                </div>
                <div>
                  <span>Subzona con mas alertas</span>
                  <p>Subzona FR-2</p>
                </div>
                <div>
                  <span>Sitio con mas alertas</span>
                  <p>Sitio A8</p>
                </div>
              </div>
                <ResponsiveContainer height={600}>
                  <ComposedChart data={data}>
                    <YAxis axisLine={false} yAxisId={0} ticks={[0,25,50,75,100]} tickLine={false}/>
                    <XAxis axisLine={false} tickLine={false}/>
                    {/* <YAxis axisLine={false} yAxisId={1} ticks={[0, 20, 40]} /> */}
                    <CartesianGrid
                      stroke="#ebebeb"
                      vertical={false}
                    />
                    <Tooltip isAnimationActive={false} />
                    <Area type="monotone" dataKey="status" stroke="#50E3C2" fill="#50E3C2" strokeWidth={0} activeDot={{ r: 3 }}/>
                    <Line type="monotone" dataKey="temperature" stroke="#eb4f4f" dot={false} strokeWidth={2} activeDot={{ r: 3 }}/>
                    <Line type="monotone" dataKey="fuel" stroke="brown" dot={false} strokeWidth={2} activeDot={{ r: 3 }}/>
                    <Line type="monotone" dataKey="charge" stroke="#f0e724" dot={false} strokeWidth={2} activeDot={{ r: 3 }}/>
                    <Line type="monotone" dataKey="humidity" stroke="blue" dot={false} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div>
          <div>Sitios</div>
          <div>
            <span>Mostrar</span>
            <span className="selector">
              Temperatura
              <ul>
                <li></li>
              </ul>
            </span>
          </div>
          <div className="box">

          </div>
        </div>
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
