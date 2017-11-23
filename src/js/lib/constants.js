export default {
  // hostUrl: 'https://demo.kawlantid.com'
  hostUrl: 'http://localhost:8080',
  colors: value => {
    if (value > 75) {
      return '#50E3C2'
    } else if (value < 40) {
      return '#ed2a20'
    }
    return '#FFC511'
  }
}
