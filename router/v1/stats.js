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

  console.log('STATS')
  const fromDate = new Date(from)
  const toDate = new Date(to)

  // console.log(req._user.cmp)
  // console.log(mongoose.version)

  // Site.find({ company: req._user.cmp, history: { $elemMatch: { timestamp: 1512004317599 }} })
  // .select('company history')
  // .then(sites => {
  //   console.log({sites})
  //   sites.map(site => console.log({ history: site.company }))
  //
  //   return res.status(200).json({ history })
  // })

  Site.aggregate([
    { $match: { company: mongoose.Types.ObjectId(req._user.cmp) }}, // We need to cast the string to ObjectId
    { $unwind: '$history' },
    { $match: { 'history.timestamp': 1512004317599 }}
  ])
  .then(sites => {
    console.log('length', sites.length)
    sites.map(site => console.log({ history: site.history }))

    return res.status(200).json({ sites })
  })
  .catch(error => {
    console.log({ error })
    return res.status(500).json({ error })
  })
})

router.route('/:zoneId')
.get((req, res) => {
  const params = req.params
})

module.exports = router
