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
      value: Number,
      dissmissed: Boolean
    }],
     timestamp: { type: Number, default: Date.now } // Unix timestamp. Time when the capture was done
},{ _id: false })

const schema = new Schema({
  key: { type: String, unique: true, required: true },
  name: String,
  position: [Number], // Lat, lng
  sensors: [{
    key: String,
    value: Number
  }],
  alarms: [{
    sensor: String, // Sensor id
    value: Number
  }],
  timestamp: { type: Number, default: Date.now() }, // Last updated
  history: [History],
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // TODO set required
  subzone: { type: Schema.Types.ObjectId, ref: 'Subzone' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' }
})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
