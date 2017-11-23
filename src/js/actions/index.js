/*

        L O A D I N G

 */
export function setLoading() {
  return {
    type: 'SET_LOADING'
  }
}

export function setComplete() {
  return {
    type: 'SET_COMPLETE'
  }
}

/*

        A L E R T S

 */
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

/*

        C R E D E N T I A L S

 */
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

/*

        Z O N E S

 */
export function setZone(id, name, positions) {
  return {
    type: 'SET_ZONE',
    id,
    name,
    positions
  }
}

export function setExhaustive(zones) {
  return {
    type: 'SET_EXHAUSTIVE',
    zones
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

export function setAllSites(zoneId, subzoneId, sites) {
  return {
    type: 'SET_ALL_SITES',
    zoneId,
    subzoneId,
    sites
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

/*

        R E P O R T S

 */
export function setReport(report) {
  return {
    type: 'SET_REPORT',
    report
  }
}

export function setInitialReports(reports) {
  return {
    type: 'SET_INITAL_REPORTS',
    reports
  }
}

export function dismissReport(reportId) {
  return {
    type: 'DISMISS_REPORT',
    report: reportId
  }
}
