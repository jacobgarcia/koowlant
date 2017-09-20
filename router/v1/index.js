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

// TODO: Save sites and stream change

// TODO: Save zone/subzone and stream change

// TODO: Save sensors and alerts, add to history and stream change

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

module.exports = router
