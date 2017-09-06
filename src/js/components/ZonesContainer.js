import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { MiniZone } from './'

function ZonesContainer(props) {
  return (
    <div>
      <div className="mini-sites-menu">
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
      </div>
      <div className={`mini-sites-container ${props.viewStyle}`}>
        {
          props.zones.map(zone =>
            <Link
              to={`/zones/${zone._id}`}
              key={zone._id}>
              <MiniZone
                id={zone._id}
                name={zone.name}
                zone={zone}
                reports={props.reports}
                highlighted={props.highlightedZone}
                onHover={props.onHover}
                active={props.highlightedZone === zone._id}
                subZone={props.subZones}
              />
            </Link>
          )
        }
      </div>
    </div>
  )
}

ZonesContainer.propTypes = {
  zones: PropTypes.array.isRequired,
  viewStyle: PropTypes.string.isRequired,
  viewOrdering: PropTypes.string
}

export default ZonesContainer
