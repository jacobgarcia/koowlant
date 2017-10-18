// Alerts
export function alert(title, body) {
  return {
    type: 'SET_ALERT',
    title,
    body
  }
}

export function dismissAlert() {
  return {
    type: 'DISMISS_ALERT'
  }
}

// Auth
export function logout() {
  return {
    type: 'LOG_OUT'
  }
}

export function setCredentials(user, token) {
  return {
    type: 'SET_USER',
    user,
    token
  }
}

export function setAlarmAttended(alarm) {
  return {
    type: 'SET_ATTENDED',
    alarm
  }
}

// Zones
export function setZone(id, name, positions) {
  return {
    type: 'SET_ZONE',
    id,
    name,
    positions
  }
}

export function setSubzone(zoneId, subzoneId, name, positions) {
  return {
    type: 'SET_SUBZONE',
    zoneId,
    subzoneId,
    name,
    positions
  }
}

export function setSite(zoneId, subzoneId, siteId, key, name, position) {
  return {
    type: 'SET_SITE',
    zoneId,
    subzoneId,
    siteId,
    key,
    name,
    position
  }
}

export function setReport(report) {
  return {
    type: 'SET_REPORT',
    report
  }
}

export function dismissReport(reportId) {
  return {
    type: 'DISMISS_REPORT',
    report: reportId
  }
}
