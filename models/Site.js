/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const History = new Schema({
    sensors: [{
      name: String,
      value: Number
    }, { _id: false }],
    alarms: [{
      sensor: String, // Sensor id
      value: Number,
      dissmissed: { type: Boolean, default: false }
    }, { _id: false }],
    timestamp: { type: Number, default: Date.now } // Unix timestamp. Time when the capture was done
},{ _id: false })

const schema = new Schema({
  key: { type: String, default: String(Date.now()) },
  name: String,
  position: [Number], // Lat, lng
  sensors: [{
    key: String,
    value: Number
  },{ _id: false }],
  alarms: [{
    key: String, // Sensor id
    value: Number
  }, { _id: false }],
  timestamp: { type: Number, default: Date.now() }, // Last updated
  history: [History],
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // TODO set required
  subzone: { type: Schema.Types.ObjectId, ref: 'Subzone' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' }
})

// Set company-key unique
schema.index({ key: 1, company: 1}, { unique: true })

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
