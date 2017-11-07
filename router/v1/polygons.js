/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const State = require(path.resolve('models/State'))

router.route('/polygons/:country/:state/coordinates')
.get((req, res) => {
  const { country, state } = req.params
  //TODO: Country
  State.findOne({ state })
  .select('positions')
  .exec((error, positions) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!positions) return res.status(404).json({ message: 'No state found'})

    return res.status(200).json({ positions })
  })
})

router.route('/polygons/:country/states')
.get((req, res) => {
  const { country } = req.params
  //TODO: Country
  State.find({ })
  .select('name')
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
