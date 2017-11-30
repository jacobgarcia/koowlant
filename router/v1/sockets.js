/* eslint-env node */
const winston = require('winston')
const jwt = require('jsonwebtoken')
const path = require('path')
const config = require(path.resolve('config/config'))
const Site = require(path.resolve('models/Site'))
const User = require(path.resolve('models/User'))

function sockets(io) {
  io.on('connection', socket => {
    socket.emit('connect')

    socket.on('join', token => {

      if (!token) {
        return null
      }

      // Verify token and get decoded info
      return jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          winston.error('Failed to authenticate token', err, token)
          return null
        }

        const { cmp: companyId, acc: access = 0, _id: userId} = decoded

        // TODO get user granted zone or subzone
        // and join all the sites that are in that
        // zone or subzone
        switch (access) {
          case 3:
            return Site.find({company: companyId})
            .select('key')
            .then(sites => {
              sites.map(site => {
                if (site.key === null) return
                // winston.debug(`Joining ${decoded._id} to ${companyId}-${site.key}`)
                socket.join(`${companyId}-${site.key}`)
                io.to('some-room').emit('reload')
              })
            })
          case 1:
          case 0:
            User.findById(userId)
            .select('zones subzones')
            .then(({zones, subzones}) => {
              return Site.find({ $or: [{ zone: { $in: zones }} , { subzone: { $in: subzones}}]})
            })
            .then(sites => {
              sites.map(site => {
                if (site.key === null) return
                // winston.debug(`Joining ${decoded._id} to ${companyId}-${site.key}`)
                socket.join(`${companyId}-${site.key}`)
              })
            })
            .catch(error => {
              winston.info(error)
            })
            return null
          default:
            return winston.info('User could not join any')
        }
      })
    })
  })

  global.io = io
}

module.exports = sockets
