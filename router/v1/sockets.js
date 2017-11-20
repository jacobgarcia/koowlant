/* eslint-env node */
const winston = require('winston')
const jwt = require('jsonwebtoken')
const path = require('path')
const config = require(path.resolve('config/config'))
const Site = require(path.resolve('models/Site'))

function sockets(io) {
  io.on('connection', socket => {
    socket.on('join', token => {

      // Verify token and get decoded info
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          winston.error('Failed to authenticate token', err, token)
          return res.status(400).json({ message: 'Not authorized' })
        }

        // TODO get user granted zone or subzone
        // and join all the sites that are in that
        // zone or subzone
        switch (decoded.acc) {
          case 3:
            return Site.find(decoded.cmp)
            .select('key')
            .then(sites => {
              sites.map(site => {
                if (site.key === null) return
                winston.info(`Joining ${decoded._id} to ${decoded.cmp}-${site.key}`)
                socket.join(`${decoded.cmp}-${site.key}`)
              })
            })
          case 1:
          case 0:
            if (decoded.zon) {
              return Site.find({zone: decoded.zon})
              .select('key')
              .then(sites => {
                sites.map(site => {
                  socket.join(`${decoded.cmp}-${site.key}`)
                })
              })
            } else if (decoded.sbz) {
              return Site.find({subzone: decoded.sbz})
              .select('key')
              .then(sites => {
                sites.map(site => {
                  socket.join(`${decoded.cmp}-${site.key}`)
                })
              })
            }
            return null
          default:
            return null
        }
      })
    })
  })

  // io.on('connection', socket => {
  //   socket.on('join', token => {
  //

  //
  //   })
  // })

  global.io = io
}

module.exports = sockets
