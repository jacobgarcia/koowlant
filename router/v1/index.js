/* eslint-env node */
const express = require('express')
const path = require('path')
const router = new express.Router()
require(path.resolve('models/Company'))
const mongoose = require('mongoose')
const winston = require('winston')
const Site = require(path.resolve('models/Site'))

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

// Save sensors and alarms, add to history and stream change
router.route('/:siteKey/reports')
.put((req, res) => {
    const { sensors, alarms } = req.body
    const { siteKey } = req.params
    const company = req._user.cmp

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

        site.save((error, updatedSite) => {

          if (error) {
            winston.error({error})
            return res.status(500).json({ error })
          }

          const report = {
            site: {
              _id: updatedSite._id,
              key: updatedSite.key
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

// Authenticate before any possible request
router.use(require(path.resolve('router/v1/auth')))

// The next things will be protected by auth
router.use(require(path.resolve('router/v1/companies')))
router.use(require(path.resolve('router/v1/users')))
router.use(require(path.resolve('router/v1/polygons')))
router.use(require(path.resolve('router/v1/stats')))

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

router.use((req, res) => {
  return res.status(400).json({ message: 'No route' })
})

module.exports = router
