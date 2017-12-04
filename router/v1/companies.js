/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const config = require(path.resolve('config/config'))

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Subzone = require(path.resolve('models/Subzone'))
const User = require(path.resolve('models/User'))


router.route('/site-token')
.post((req, res) => {
  if (req._user.acc < 3) {
    return res.status(401).json({ message: 'Not enough privilegies' })
  }

  if (!req.body.company) return res.status(400).json({message: 'Missing company parameter'})
  if (!req.body.site) return res.status(400).json({message: 'Missing site parameter'})

  const token = jwt.sign({
    cmp: req.body.company,
    ste: req.body.site
  }, config.secret)

  return res.status(200).json({ token })
})

router.route('/users')
.get((req, res) => {
  const company = req._user.cmp

  // TODO verify user has sufficient permissions
  // TODO add monitoring zones or subzones
  User.find({ company })
  .select('email name surname access')
  .then(users => {
    return res.status(200).json({ users })
  })
  .catch(error => {
    winston.error({error})
    return res.status(500).json({ error })
  })

})

// Save sites and stream change
router.route('/zones/:zone/subzones/:subzone/sites')
.post((req, res) => {
    const { name, position } = req.body
    let key = req.body.key
    const { zone, subzone } = req.params
    const company = req._user.cmp

    if (key === null || key === 'null') key = String(Date.now())

    // Create site using the information in the request body
    new Site({
      key,
      name,
      position,
      subzone,
      zone,
      company
    })
    .save((error, site) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }
      // Add the new site to the specified subzone
      return Subzone.findByIdAndUpdate(subzone, { $push: { sites: site } }, { new: true })
      .exec(error => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        return res.status(200).json({ site })
      })
    })
})

// Save subzone and stream change
router.route('/:zoneId/subzones')
.post((req, res) => {
    const { name, positions, sites } = req.body
    const { zoneId } = req.params
    const company = req._user.cmp

    // Create subzone using the information in the request body
    new Subzone({
      name,
      positions,
      parentZone: zoneId,
      sites,
      company
    })
    .save((error, subzone) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }
      // Add the new site to the specified zone
      return Zone.findByIdAndUpdate(zoneId, { $push: { subzones: subzone._id } }, { new: true })
      .exec((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }
        if (!zone) return res.status(404).json({ message: 'No zone found'})

        return res.status(200).json({ subzone })
      })
    })
})

//  Save zone and stream change
router.route('/zones')
.post((req, res) => {
    const { name, positions } = req.body
    const company = req._user.cmp

    // Create subzone using the information in the request body
    new Zone({
      name,
      positions,
      company
    })
    .save((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        return res.status(200).json({ zone })
    })
})

// Get zones. TODO: Retrieve only company zones
router.route('/zones')
.get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company })
  .exec((error, zones) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!zones) return res.status(404).json({ message: 'No zones found'})

    return res.status(200).json({ zones })
  })
})

// Get subzones. TODO: Retrieve only company subzones
router.route('/subzones')
.get((req, res) => {
  const company = req._user.cmp

  Subzone.find({ company })
  .exec((error, subzones) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!subzones) return res.status(404).json({ message: 'No subzones found'})

    return res.status(200).json({ subzones })
  })
})


router.route('/sites')
.get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
  .exec((error, sites) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!sites) return res.status(404).json({ message: 'No sites found'})

    return res.status(200).json({ sites })
  })
})

// Get last report for all sites
router.route('/reports')
.get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
  .populate('zone', 'name')
  .populate('subzone', 'name')
  .exec((error, sites) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    const reports = []
    sites.forEach(site => {
      reports.push({
        site: {
          _id: site._id,
          key: site.key
        },
        zone: site.zone,
        subzone: site.subzone,
        timestamp: site.timestamp,
        sensors: site.sensors,
        alarms: site.alarms
      })
    })

    return res.status(200).json({ reports })
  })
})

// Get zones, subzones and sites
router.route('/exhaustive')
.get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company })
  .select('name positions subzones')
  .populate('subzones', 'name positions sites')
  .populate({
    path: 'subzones',
    populate: {
      path: 'sites',
      model: 'Site',
      select: 'alarms name key position sensors timestamp'
    }
  })
  .exec((error, zones) => {

    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }
    if (!zones) return res.status(404).json({ message: 'No zones found'})

    return res.status(200).json({ zones })

  })
})

module.exports = router
