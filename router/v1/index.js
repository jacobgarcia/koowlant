/* eslint-env node */
const express = require('express')
const path = require('path')
const router = new express.Router()
const mongoose = require('mongoose')

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

// Authenticate before any possible request
router.use(require(path.resolve('router/v1/auth')))

// The next things will be protected by auth
router.use(require(path.resolve('router/v1/companies')))

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

module.exports = router
