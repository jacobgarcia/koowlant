/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const State = require(path.resolve('models/State'))

router.route('/polygons/:contryCode/:stateId')
.get((req, res) => {
  const { contryCode, stateId } = req.params

  // TODO: Country
  State.findById(stateId)
  .exec((error, state) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!state) return res.status(404).json({ message: 'No state found'})

    return res.status(200).json({ state })
  })
})

router.route('/polygons/:countryCode')
.get((req, res) => {
  const { countryCode } = req.params
  // TODO: Country
  State.find({}, '-positions')
  .exec((error, states) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!states) return res.status(404).json({ message: 'No state found'})

    return res.status(200).json({ states })
  })
})

module.exports = router
