/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const config = require(path.resolve('config/config'))

const Site = require(path.resolve('models/Site'))


function getDeviceInfo(req, res, next) {
  const bearer = req.headers.authorization || 'Bearer '
  const token = bearer.split(' ')[1]

  if (!token) {
    return res.status(401).send({ error: { message: 'No device token provided' } })
  }

  return jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      winston.error('Failed to authenticate token', err, token)
      return res.status(401).json({ error: { message: 'Failed to authenticate device token' }})
    }

    req._site = decoded
    return next()
  })
}

// Save sensors and alarms, add to history and stream change
router.route('/reports')
.put(getDeviceInfo, (req, res) => {
    const { sensors, alarms } = req.body
    const { ste: siteKey, cmp: company } = req._site

    winston.info({key: siteKey, company})

    Site.findOne({key: siteKey, company})
    .exec((error, site) => {
      if (!site) return res.status(404).json({ message: 'No site found'})

      // TODO just update the returned site
      return Site.findByIdAndUpdate(site, { $push: { history: { sensors: site.sensors, alarms: site.alarms} } }, { new: true })
      .populate('zone', 'name')
      .populate('subzone', 'name')
      .exec((error, populatedSite) => {
        site.sensors = sensors
        site.alarms = alarms
        site.timestamp = new Date()

        site.save((error, updatedSite) => {

          if (error) {
            winston.error({error})
            return res.status(500).json({ error })
          }

          const report = {
            site: {
              _id: updatedSite._id,
              key: updatedSite.key,
              name: updatedSite.name
            },
            zone: populatedSite.zone,
            subzone: populatedSite.subzone,
            timestamp: updatedSite.timestamp,
            sensors: updatedSite.sensors,
            alarms: updatedSite.alarms
          }

          // global.io.emit('report', report)
          global.io.to(`${company}-${siteKey}`).emit('report', report)
          return res.status(200).json(report)
        })
      })

    })
})

module.exports = router
