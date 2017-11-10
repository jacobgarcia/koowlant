/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class StateClass {
  // Methods
}

const schema = new Schema({
  name: String,
  country: String,
  positions: [[Number]],
  code: Number
})

schema.loadClass(StateClass)

module.exports = mongoose.model('State', schema)
