/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = express.Router()

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Subzone = require(path.resolve('models/Subzone'))

// TODO: Save sites and stream change
router.route('/companies/:company/:subzone/sites')
.post((req, res) => {
    const { key, position, sensors, alarms } = req.body
    const { company, subzone } = req.params
    // Create site using the information in the request body
    new Site({
      key,
      position,
      sensors,
      alarms
    })
    .save((error, site) => {
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

// TODO: Save subzone and stream change
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
      // Add the new site to the specified zone
      Zone.findOneAndUpdate({ '_id': zone }, { $push: { subzones: subzone } }, { new: true })
      .exec((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        res.status(200).json({ subzone })
      })
    })
})

// TODO: Save zone and stream change
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

// TODO: Save sensors and alarms, add to history and stream change
router.route('/companies/:company/:site/reports')
.put((req, res) => {
    const { sensors, alarms } = req.body
    const { company, site } = req.params

    Site.findOne({ '_id': site })
    .exec((error, site) => {
      Site.findOneAndUpdate({ '_id': site }, { $push: { history: { sensors: site.sensors, alarms: site.alarms} } }, { new: true })
      .exec((error, updatedSite) => {
        site.sensors = sensors
        site.alarms = alarms

        site.save((error, updatedSite) => {
          if (error) {
            winston.error({error})
            return res.status(500).json({ error })
          }

          res.status(200).json({ updatedSite })
        })
      })

    })
})

module.exports = router
