/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const mongoose = require('mongoose')

mongoose.connect(
  'mongodb://localhost/kawlantid',
  { useMongoClient: true, promiseLibrary: global.Promise
  }
)

router.use(require(path.resolve('router/v1/auth')))

// The next things will be protected by auth
router.use(require(path.resolve('router/v1/companies')))

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

module.exports = router
