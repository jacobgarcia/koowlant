/* eslint-env node */
const winston = require('winston')

function sockets(io) {
  io.on('connection', socket => {
    winston.info('New connection')
    socket.on('join', room => {
      socket.join(room)
    })
  })
}

module.exports = sockets
