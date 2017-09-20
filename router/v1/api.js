/* eslint-env node */
const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const winston = require('winston')
const router = express.Router()
const mongoose = require('mongoose')

const Site = require(path.resolve('models/Site'))

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

router.route('/reports/:company_id/:site_id')
.put((req, res) => {
    const id = req.params.site_id
    const sensors = req.body.sensors
    const alarms = req.body.alarms

    Site.findOneAndUpdate({ id }, { $set: { sensors, alarms } }, { new: true })
    .exec((error, site) => {
      if (error) {
        console.log(error)
        return res.status(500).json({ error })
      }
      
      res.status(200).json({ site })
    })

})

module.exports = router
