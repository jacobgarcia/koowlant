/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const schema = new Schema({
  key: String,
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
      timestamp: { type: Number, default: Date.now() }, // Unix timestamp. Time of the alert event
      value: Number,
      dissmissed: Boolean
    }],
     timestamp: { type: Number, default: Date.now() } // Unix timestamp. Time when the capture was done
  }]
})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
