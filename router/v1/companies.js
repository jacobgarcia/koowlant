/* eslint-env node */
const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const winston = require('winston')
const router = express.Router()
const mongoose = require('mongoose')

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Subzone = require(path.resolve('models/Subzone'))

mongoose.connect(
  'mongodb://localhost/kawlantid',
  { useMongoClient: true, promiseLibrary: global.Promise
  }
)

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
          console.log(error)
          return res.status(500).json({ error })
        }

        res.status(200).json({ site })
      })
    })
})

// TODO: Save subzone and stream change
router.route('/companies/:company/:zone/subzones')
.post((req, res) => {
    const { name, positions, parentZone, sites } = req.body
    const { company, zone } = req.params
    // Create subzone using the information in the request body
    new Subzone({
      name,
      positions,
      parentZone,
      sites
    })
    .save((error, subzone) => {
      // Add the new site to the specified zone
      Zone.findOneAndUpdate({ '_id': zone }, { $push: { subzones: subzone } }, { new: true })
      .exec((error, subzone) => {
        if (error) {
          console.log(error)
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
          console.log(error)
          return res.status(500).json({ error })
        }

        res.status(200).json({ zone })
    })
})

// TODO: Save sensors and alerts, add to history and stream change
router.route('/companies/:company/:site/reports')
.put((req, res) => {
    const { sensors, alarms } = req.body
    const { company, site } = req.params

    Site.findOne({ '_id': site })
    .exec((error, site) => {
      site.history.push(site.sensors, site.alerts)
      site.sensors = sensors
      site.alarms = alarms

      site.save((error, updatedSite) => {
        if (error) {
          console.log(error)
          return res.status(500).json({ error })
        }

        res.status(200).json({ updatedSite })
      })
    })
})

module.exports = router
