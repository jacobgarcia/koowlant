/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const History = new Schema({
    sensors: [{
      name: String,
      value: Number
    }],
    alarms: [{
      sensor: String, // Sensor id
      timestamp: { type: Number, default: Date.now() }, // Unix timestamp. Time of the alert event
      value: Number,
      dissmissed: Boolean
    }],
     timestamp: { type: Number, default: Date.now() } // Unix timestamp. Time when the capture was done
},{ _id : false })

const schema = new Schema({
  key: { type: String, unique: true, required: true },
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
  history: [History]
})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
