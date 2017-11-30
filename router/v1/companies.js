/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Subzone = require(path.resolve('models/Subzone'))
const User = require(path.resolve('models/User'))

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
