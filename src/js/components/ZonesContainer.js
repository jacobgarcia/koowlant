import React from 'react'
import PropTypes from 'prop-types'

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

Video.propTypes = {
  source: PropTypes.string.isRequired
}

function ZonesContainer(props) {

  const getMiniZoneLink = zone => {
    switch (props.type) {
      case 'general': return `/zones/${zone._id}`
      case 'zone': return `/zones/${props.zone._id}/${zone._id}`
      case 'subzone': return `/zones/${props.zone._id}/${props.subzone._id}/${zone._id}`
      case 'site': return 'Torre ' + name
      default: return `/`
    }
  }

  const getElements = type => {
    switch (type) {
      case 'general': return props.zone
      case 'zone': return props.zone.subzones
      case 'subzone': return props.subzone.sites
      case 'site': return props.site.sensors
      default: return []
    }
  }

  const elements = getElements(props.type)

  return (
    <div>
      {
        props.type === 'site'
        && <div className="sensors-cameras">
            <span
              onClick={() => props.changeView('sensors')}
              className={props.currentView === 'sensors' ? 'selected' : ''}>
              Sensores
            </span>
            <span
              onClick={() => props.changeView('cameras')}
              className={props.currentView === 'cameras' ? 'selected' : ''}>
              Cámaras
            </span>
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
              <span className="dynamic small-icon" />
              <span className="static small-icon" />
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
                  to={getMiniZoneLink(element)}
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
  changeView: PropTypes.function,
  currentView: PropTypes.string.isRequired
}

export default ZonesContainer
