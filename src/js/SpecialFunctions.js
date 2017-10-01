/* eslint max-statements: ["error", 15] */

export function hashCode(str = '') { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

export function substractReportValues(reports) {
  console.log('Got reports', reports)
  return {
    alarms: (reports && reports[0]) ? reports[0].alarms.reduce((sum, alm) => [...alm.values, ...sum], []) : [],
    sensors: (reports && reports[0]) ? reports[0].sensors.reduce((sum, sns) => [...sns.values, ...sum], []) : []
  }
}

function getSubzoneData(subzone) {
  return subzone.sites
  ? subzone.sites.reduce((array, {alarms = [], sensors = []}) =>
    ({ alarms: [...array.alarms, ...alarms], sensors: [...array.sensors, ...sensors] })
  , { alarms: [], sensors: [] })
  : ({ alarms: [], sensors: [] })
}

function getZoneData(zone) {
  return zone.subzones.reduce((array, subzone) => {
    const { alarms = [], sensors = [] } = getSubzoneData(subzone) || { alarms: [], sensors: []}
    return ({ alarms: [...array.alarms, ...alarms], sensors: [...array.sensors, ...sensors] })
  }, { alarms: [], sensors: [] })
}

// Filter reports that belong to zone, subzone or site
/**
 * Returns the reports that belong to an element (zone, subzone or site)
 * @param  {Array} reports Reports to be filtered
 * @param  {Object} element Object to be matched with
 * @return {Array}         Filtered reports
 */
export const getFilteredReports = (reports, element) => {
  const filteredReports = reports.filter(({ site }) => {
    let shouldReturn = false
    const siteKey = site.key

    if (Array.isArray(element)) {
      shouldReturn = element.some(({subzones}) => {
        return subzones.some(({ sites }) => {
          return Array.isArray(sites)
          ? sites.some(({ key }) => {
             return siteKey === key
          })
          : false
        })
      })
    } else if (element.subzones) {
      shouldReturn = element.subzones.some(({ sites }) => {
        return Array.isArray(sites)
        ? sites.some(({ key }) => {
           return siteKey === key
        })
        : false
      })
    } else if (element.sites) {
      Array.isArray(element.sites) ?
      shouldReturn = element.sites.some(({ key }) => {
        return siteKey === key
      })
      : null
    } else if (element.key === siteKey) {
      shouldReturn = true
    }
    return shouldReturn
  })

  // Sort by timestamp
  // filteredReports.sort(({ timestamp: a }, { timestamp: b }) => {
  //   return b - a
  // })

  return filteredReports
}

export function getData(zone) {
  if (Array.isArray(zone)) {
    // All zones
    return zone.reduce((array, zone) => {
      const zoneData = getZoneData(zone)
      return { alarms: [...array.alarms, ...zoneData.alarms], sensors: [...array.sensors, ...zoneData.sensors] }
    }, { alarms: [], sensors: [] })
  } else if (zone.subzones) {
    // Complete zone
    return getZoneData(zone)
  } else if (zone.sites) {
    // Subzone
    return getSubzoneData(zone)
  } else if (zone.sensors) {
    // Site
    return { alarms: zone.alarms || [], sensors: zone.sensors || [] }
  } else {
    return null
  }
}

export function getSensorChart(type) {
  switch (type) {
    case 'TEMPERATURE':
      return [{
        name: 'alerts',
        value: 15,
      },{
        name: 'warnings',
        value: 10,
      },{
        name: 'normal',
        value: 80
      },{
        name: 'warnings',
        value: 5,
      },{
        name: 'alerts',
        value: 10,
      }]
    default:
      return null
  }
}

export function getStatus(data) {
  if (data && data.sensors && data.sensors.length > 0) {
    return ({
        status: [
          { name: 'normal', value: data.sensors.length - (data.alarms ? data.alarms.length : 0) },
          { name: 'alerts', value: data.alarms ? data.alarms.length : 0 },
        ],
        percentage: Math.round((1 - ((data.alarms ? data.alarms.length : 0) / data.sensors.length)) * 1000) / 10
    })
  } else {
    return { status: null, percentage: null }
  }
}

export function getAreaCenter(coordsArray) {
  // For rect and poly areas we need to loop through the coordinates
  let coord
  let minX = coordsArray[0]
  let maxX = coordsArray[0]
  let minY = coordsArray[1]
  let maxY = coordsArray[1]

  for (var i = 0, l = coordsArray.length; i < l; i += 1) {
    coord = coordsArray[i]
    if (i % 2 === 0) { // Even values are X coordinates
      if (coord < minX) {
        minX = coord;
      } else if (coord > maxX) {
        maxX = coord;
      }
    } else { // Odd values are Y coordinates
      if (coord < minY) {
        minY = coord;
      } else if (coord > maxY) {
        maxY = coord;
      }
    }
  }

  return ([
    (minX + maxX) / 2,
    (minY + maxY) / 2
  ])
}
