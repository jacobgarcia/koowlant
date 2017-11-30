/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
// const Subzone = require(path.resolve('models/Subzone'))
const { History } = require(path.resolve('models/Site'))

router.route('/stats')
.get((req, res) => {
  const query = req.query

  History.find({})
  .then(history => {
    winston.debug({history})
    return res.status(200).json({ history })
  })
})

router.route('/:zoneId')
.get((req, res) => {
  const params = req.params
})

module.exports = router
