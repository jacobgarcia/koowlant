export function setCredentials(user, token) {
  return {
    type: 'SET_USER',
    user,
    token
  }
}

export function logout() {
  return {
    type: 'LOG_OUT'
  }
}

export function setZone(name, positions) {
  return {
    type: 'SET_ZONE',
    name,
    positions
  }
}

export function setSubzone(zoneId, name, positions) {
  return {
    type: 'SET_SUBZONE',
    name,
    positions
  }
}

export function dismissReport(reportId) {
  return {
    type: 'DISMISS_REPORT',
    report: reportId
  }
}

export function setSite({zoneId, subzoneId}, name, position) {
  return {
    type: 'SET_SITE',
    zoneId,
    subzoneId,
    name,
    position
  }
}
