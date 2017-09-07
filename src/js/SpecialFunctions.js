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


export function getStatus(zoneStatus) {
  const reportsPercentage = zoneStatus ? zoneStatus.reduce((sum, status) => sum + status.value, 0) : 0
  return {
    completeStatus: zoneStatus ? [...zoneStatus, { name: 'normal', value: (1 - reportsPercentage) }] : null,
    normalPercentage: Math.round((1 - reportsPercentage) * 1000) / 10
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
