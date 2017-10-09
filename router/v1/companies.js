/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = express.Router()

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Subzone = require(path.resolve('models/Subzone'))

// Save sites and stream change
router.route('/companies/:company/:subzone/sites')
.post((req, res) => {
    const { key, name, position, sensors, alarms, parentSubzone } = req.body
    const { company, subzone } = req.params
    // Create site using the information in the request body
    new Site({
      key,
      name,
      position,
      sensors,
      alarms,
      parentSubzone
    })
    .save((error, site) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }
      // Add the new site to the specified subzone
      Subzone.findOneAndUpdate({ '_id': subzone }, { $push: { sites: site } }, { new: true })
      .exec((error, subzone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        res.status(200).json({ site })
      })
    })
})

//  Save subzone and stream change
router.route('/companies/:company/:zone/subzones')
.post((req, res) => {
    const { name, positions, sites } = req.body
    const { company, zone } = req.params
    // Create subzone using the information in the request body
    new Subzone({
      name,
      positions,
      parentZone: zone,
      sites
    })
    .save((error, subzone) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }
      // Add the new site to the specified zone
      Zone.findOneAndUpdate({ '_id': zone }, { $push: { subzones: subzone } }, { new: true })
      .exec((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }
        if (!zone) return res.status(404).json({ message: 'No zone found'})

        res.status(200).json({ subzone })
      })
    })
})

//  Save zone and stream change
router.route('/companies/:company/zones')
.post((req, res) => {
    const { name, positions, subzones } = req.body
    const { company } = req.params
    // Create subzone using the information in the request body
    new Zone({
      name,
      positions,
      subzones
    })
    .save((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        res.status(200).json({ zone })
    })
})

// Save sensors and alarms, add to history and stream change
router.route('/companies/:company/:site/reports')
.put((req, res) => {
    const { sensors, alarms } = req.body
    const { company, site } = req.params

    //global.io.emit('hey', 'hola')
    Site.findOne({ '_id': site })
    .exec((error, site) => {
      if (!site) return res.status(404).json({ message: 'No site found'})
      Site.findOneAndUpdate({ '_id': site }, { $push: { history: { sensors: site.sensors, alarms: site.alarms, timestamp: site.timestamp} } }, { new: true })
      .populate('zone', 'name')
      .populate('subzone', 'name')
      .exec((error, populatedSite) => {
        site.sensors = sensors
        site.alarms = alarms
        site.timestamp = Date.now()

        site.save((error, updatedSite) => {

          if (error) {
            winston.error({error})
            return res.status(500).json({ error })
          }

          let report = {
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

          res.status(200).json( report )
        })
      })

    })
})

module.exports = router
