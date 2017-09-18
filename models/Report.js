/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ReportClass {

}

const schema = new Schema({
  sensors: [{
    id: String,
    value: Number
  }],
  alarms: [{
    sensor: String,
    value: Number
  }]
})

schema.loadClass(ReportClass)

module.exports = mongoose.model('Zone', schema)
