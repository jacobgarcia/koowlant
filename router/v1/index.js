/* eslint-env node */
const express = require('express')
// const jwt = require('jsonwebtoken')
// const path = require('path')
const winston = require('winston')
const router = new express.Router()
const rethink = require('rethinkdb')

router.route('/:companyId/:siteId/reports')
.post((req, res) => {
  rethink.connect({ host: 'localhost', port: 28015 })
  .then(connection => {
    return rethink.db('kawlantid').table('reports')
    .insert({
      sensors: req.body.sensors,
      alarms: req.body.alarms,
      site: req.params.siteId,
      company: req.params.companyId
    })
    .run(connection)
  })
  .then(result => {
    winston.debug(result)
    res.status(200).json({ result })
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

module.exports = router
