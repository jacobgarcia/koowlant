/* eslint-env node */
const winston = require('winston')

function sockets(io) {
  io.on('connection', socket => {
    winston.info('New connection')
    // TODO: Validate thru JWT

    socket.on('join', companyId => {
      socket.join(companyId)
    })
  })
}

module.exports = sockets
