/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const schema = new Schema({
  id: String,
  name: String,
  position: [Number],
  sensors: [{
    value: Number
  }],
  alarms: [{
    value: Number,
    timestamp: Date
  }]
})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
