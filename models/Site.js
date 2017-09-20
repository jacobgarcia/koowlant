/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const schema = new Schema({
  id: String,
  name: String,
  position: [Number], // Lat, lng
  sensors: [{
    name: String,
    value: Number
  }],
  alarms: [{
    sensor: String, // Sensor id
    timestamp: { type: Number, default: Date.now() }, // Unix timestamp
    value: Number
  }],
  history: [{ // Save a history of sensors and alarms reports
    sensors: [{
      name: String,
      value: Number
    }],
    alerts: [{
      sensor: String, // Sensor id
      timestamp: { type: Number, default: Date.now() }, // Unix timestamp
      value: Number
    }],
  }]
})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
