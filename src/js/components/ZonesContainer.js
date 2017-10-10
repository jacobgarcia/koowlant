import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell } from 'recharts'

import { Link } from 'react-router-dom'
import { MiniZone } from './'
import { getFilteredReports } from '../SpecialFunctions'

function Video(props) {
  return (
    <video className="camera-video" controls autoPlay loop>
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

const getElements = (type, props) => {
  switch (type) {
    case 'general': return props.zone
    case 'zone': return props.zone.subzones
    case 'subzone': return props.subzone.sites
    case 'site': return props.site.sensors
    default: return []
  }
}

function ZonesContainer(props) {
  const elements = getElements(props.type, props)

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
          <h3>Información</h3>
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
        </div>
      }
      {
        // Camera sites view
        (props.site && props.currentView === 'cameras')
        &&
        <div className="cameras-container">
          <Video source="/uploads/video/test-1.mp4" />
          <Video source="/uploads/video/test-2.mp4" />
          <Video source="/uploads/video/test-3.mp4" />
          <Video source="/uploads/video/test-4.mp4" />
        </div>
      }
      {
        (props.currentView === 'sensors' || props.site === null)
        &&
        [
          <div className="mini-sites-menu" key="mini-sites-menu">
            <div className="view-ordering">
              <span className="dynamic small-icon" onClick={() => props.onViewChange('STATIC')}/>
              <span className="static small-icon" onClick={() => props.onViewChange('DYNAMIC')}/>
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
          <div className={`mini-sites-container ${props.viewStyle}`} key="mini-sites-container">
            {
              Array.isArray(elements)
              && elements.map((element, index) =>
                <Link
                  to={getMiniZoneLink(element, props)}
                  key={index}>
                  <MiniZone
                    onHover={props.onHover}
                    type={props.type}
                    id={element._id}
                    name={element.name}
                    zone={element}
                    active={props.highlightedZone === element._id}
                    reports={getFilteredReports(props.reports, element)}
                  />
                </Link>
              )
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
                <div key={sensor.key} className="graph">
                  <h3>{sensor.key}</h3>
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
  sensors: PropTypes.array
}

ZonesContainer.defaultProps = {
  onViewChange: () => {}
}

export default ZonesContainer
