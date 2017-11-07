/* eslint-env node */
const express = require('express')
const path = require('path')
const router = new express.Router()
require(path.resolve('models/Company'))
const mongoose = require('mongoose')

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

// Authenticate before any possible request
router.use(require(path.resolve('router/v1/auth')))

// The next things will be protected by auth
router.use(require(path.resolve('router/v1/companies')))
router.use(require(path.resolve('router/v1/users')))
router.use(require(path.resolve('router/v1/polygons')))

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

router.use((error, req, res, next) => {
  res.status(500).json({ error })
})

module.exports = router
