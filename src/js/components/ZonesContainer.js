import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell } from 'recharts'

import { Link } from 'react-router-dom'
import { MiniZone, Stream } from './'
import { substractReportValues, getStatus, getFilteredReports } from '../SpecialFunctions'

function Video(props) {
  return (
    <video className="camera-video" controls loop>
      <source src={props.source} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

const COLORS = {
  alerts: '#ed2a20',
  warnings: '#FFC511',
  normal: '#50E3C2'
}

Video.propTypes = {
  source: PropTypes.string.isRequired
}

const getMiniZoneLink = (zone, props) => {
  switch (props.type) {
    case 'general': return `/zones/${zone._id}`
    case 'zone': return `/zones/${props.zone._id}/${zone._id}`
    case 'subzone': return `/zones/${props.zone._id}/${props.subzone._id}/${zone._id}`
    case 'site': return 'Torre ' + name
    default: return `/`
  }
}

function getSensorName(code) {
  if (code.length < 3) return null
  let name = ''
  switch (code.charAt(0)) {
    case 't':
    name += 'Temperatura'
    break
    default:
    name += 'Sensor'
    break
  }
  name += ` ${code.charAt(2)}`
  return name
}

function ZonesContainer(props) {
  const elements = props.elements
  const url = 'localhost'
  const videoJsOptions = {
    autoplay: true,
    controls: false,
    sources: [{
      src: 'rtmp://' + url + '/live&idiots' ,
      type: 'rtmp/mp4'
    }],
    width: 480
  }
  return (

    <div>
      {
        props.type === 'site'
        && <div className="sensors-cameras">
            <span
              onClick={() => props.onViewChange('sensors')}
              className={props.currentView === 'sensors' ? 'selected' : ''}>
              Sensores
            </span>
            <span
              onClick={() => props.onViewChange('cameras')}
              className={props.currentView === 'cameras' ? 'selected' : ''}>
              Cámaras
            </span>
            <span
              onClick={() => props.onViewChange('info')}
              className={props.currentView === 'info' ? 'selected' : ''}>
              Información
            </span>
          </div>
      }
      {
        (props.site && props.currentView === 'info')
        &&
        <div className="info-container">
          <div>
            <label htmlFor="address">Dirección</label>
            <input type="text" id="address" placholder="Dirección"/>
          </div>
          <div>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" placholder="Nombre"/>
          </div>
          <div>
            <label htmlFor="key">Key</label>
            <input type="text" id="key" placholder="Key" readOnly/>
          </div>
          <div>
            <label htmlFor="notes">Notas adicionales</label>
            <textarea name="" id="" cols="30" rows="10"></textarea>
          </div>
        </div>
      }
      {
        // Camera sites view
        (props.site && props.currentView === 'cameras')
        &&
        <div className="cameras-container">
           <Stream { ...videoJsOptions } className="camera-video" />
        </div>
      }
      {
        (props.currentView === 'sensors' || props.site === null)
        &&
        [
          // VIEW SETTINGS BAR
          <div className="mini-sites-menu" key="mini-sites-menu">
            <div className="view-ordering">
              <span className={`dynamic small-icon ${props.viewSort !== 'DYNAMIC' && 'deactive'}`} onClick={() => props.onViewSortChange('DYNAMIC')}/>
              <span className={`static small-icon ${props.viewSort !== 'STATIC' && 'deactive'}`} onClick={() => props.onViewSortChange('STATIC')}/>
            </div>
            <div className="view-settings">
              <span
                className={`list small-icon ${props.viewStyle === 'list' ? '' : 'deactive'}`}
                onClick={() => props.changeSitesView('list')}
              />
              <span
                className={`grid small-icon ${props.viewStyle === 'grid' ? '' : 'deactive'}`}
                onClick={() => props.changeSitesView('grid')}
              />
            </div>
          </div>,
          // MINI ZONES
          <div className={`mini-sites-container ${props.viewStyle}`} key="mini-sites-container">
            {
              (Array.isArray(elements) && elements.length)
              && elements.map((element, index) => {
                let reports = getFilteredReports(props.reports, element)
                reports = substractReportValues(reports)
                const { status, percentage } = getStatus(reports || null)

                return (
                  <Link
                    to={getMiniZoneLink(element, props)}
                    key={index}
                    style={{order: props.viewSort === 'DYNAMIC' ? Math.round(percentage) : 0 }}>
                    <MiniZone
                      onHover={props.onHover}
                      type={props.type}
                      id={element._id}
                      name={element.name}
                      zone={element}
                      active={props.highlightedZone === element._id}
                      reports={reports}
                      status={status}
                      percentage={percentage}
                    />
                  </Link>
                )
              })
              // : <div className="no-content">
              //     <div className="kawlant-logo"></div>
              //     <span>Sin elementos</span>
              //   </div>
            }
          </div>
        ]
      }
      {
        (props.currentView === 'sensors' && props.site)
        &&
        <div className={`mini-sites-container ${props.viewStyle}`} key="mini-sites-container">
          {
            props.sensors.map(sensor =>
                <div key={sensor.key} className="sensor graph" style={props.viewSort === 'DYNAMIC' ? {order: Math.round(sensor.value * -1)} : {}}>
                  <h3>{getSensorName(sensor.key)}</h3>
                  <PieChart width={70} height={70}>
                    <Pie
                      dataKey="value"
                      data={[{ name: 'val', value: sensor.value},{ name: 'rest', value: 100 - sensor.value }]}
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
                    <Cell fill={'#ed2a20'} />
                    <Cell fill={'#50E3C2'} />
                    </Pie>
                  </PieChart>
                  {
                    <span className="percentage">{sensor.value}%</span>
                  }
                </div>
            )
          }
        </div>
      }
    </div>
  )
}

ZonesContainer.propTypes = {
  type: PropTypes.string.isRequired,
  zones: PropTypes.array,
  subzones: PropTypes.array,
  viewStyle: PropTypes.string.isRequired,
  viewOrdering: PropTypes.string,
  changeSitesView: PropTypes.func,
  site: PropTypes.object,
  subzone: PropTypes.object,
  onHover: PropTypes.func,
  zone: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  highlightedZone: PropTypes.string,
  reports: PropTypes.array,
  onViewChange: PropTypes.func,
  currentView: PropTypes.string.isRequired,
  sensors: PropTypes.array,
  viewSort: PropTypes.string
}

ZonesContainer.defaultProps = {
  onViewChange: () => {}
}

export default ZonesContainer
