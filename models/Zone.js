/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ZoneClass {

}

const schema = new Schema({
  parentZone: String,
  positions: [[Number]],
  name: String,
  sites: [{type: mongoose.schema.objectId, ref: ''}]
})

schema.loadClass(ZoneClass)

module.exports = mongoose.model('Zone', schema)
