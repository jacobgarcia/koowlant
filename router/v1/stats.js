/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
// const Subzone = require(path.resolve('models/Subzone'))
const Site = require(path.resolve('models/Site'))
const mongoose = require('mongoose')

router.route('/stats')
.get((req, res) => {
  const { from, to } = req.query

  const fromDate = new Date(from)
  const toDate = new Date(to)

  Site.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req._user.cmp) }}, // We need to cast the string to ObjectId
    // { NOT USING
    //   $lookup: {
    //     from: 'zones',
    //     localField: 'zone',
    //     foreignField: '_id',
    //     as: 'zone'
    //   }
    // },
    { $unwind: '$history' },
    { $match: { 'history.timestamp': { $gte: fromDate, $lte: toDate } }},
    { $group: {
      _id: { zone: '$zone', month: { $month: '$timestamp' }, day: { $dayOfMonth: '$timestamp' }, year: { $year: '$timestamp' } },
      alarmsCount: { $sum: { $size: '$history.alarms' }},
      sensorsCount: { $sum: { $size: '$history.sensors' }},
      count: { $sum: 1 }
      }
    },
    { $project: {
      zone: '$id.zone',
      averageHealth: { $multiply: [100, {$subtract: [1, {$divide: ['$alarmsCount', '$sensorsCount']}]}]}
    }},
    {
      $group: {
        _id: { day: '$_id.day', month: '$_id.month', year: '$_id.year' },
        zones: { $addToSet: {_id: '$_id.zone', health: '$averageHealth' } }
      }
    }
  ])
  .then(zonesAverage => {
    const data = zonesAverage.map(({_id, zones}) => {
      const day = { name: `${_id.day}/${_id.month}/${_id.year}` }

      zones.map(({_id, health}) => {
        day[_id] = Math.round(health * 100) / 100
      })

      return day

    })
    return res.status(200).json({ data })
  })
  .catch(error => {
    return res.status(500).json({ error })
  })
})

router.route('/alarms')
.get((req, res) => {
  const { from, to } = req.query

  const fromDate = new Date(from)
  const toDate = new Date(to)

  Site.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(req._user.cmp) }}, // We need to cast the string to ObjectId
    { $unwind: '$history' },
    { $match: { 'history.timestamp': { $gte: fromDate, $lte: toDate } }},
    { $group: {
      _id: { zone: '$zone', month: { $month: '$timestamp' }, day: { $dayOfMonth: '$timestamp' }, year: { $year: '$timestamp' } },
      alarmsCount: { $sum: { $size: '$history.alarms' }},
      count: { $sum: 1 }
      }
    },
    { $project: {
      zone: '$id.zone',
      alarmsCount: { $sum: '$alarmsCount' }
    }},
    {
      $group: {
        _id: { day: '$_id.day', month: '$_id.month', year: '$_id.year' },
        zones: { $addToSet: {_id: '$_id.zone', alarms: '$alarmsCount' } }
      }
    }
  ])
  .then(zonesAverage => {
    const alarms = zonesAverage.map(({_id, zones}) => {
      const day = { name: `${_id.day}/${_id.month}/${_id.year}` }

      zones.map(({_id, alarms}) => {
        day[_id] = alarms
      })

      return day

    })
    return res.status(200).json({ alarms })
  })
  .catch(error => {
    return res.status(500).json({ error })
  })
})
module.exports = router
