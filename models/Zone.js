/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ZoneClass {
  // Methods
}

const schema = new Schema({
  positions: [[Number]],
  name: String,
  subzones: [{ type: mongoose.schema.objectId, ref: 'Zone' }], // Id of the subzones that belong to this zone, if applicable
})

schema.loadClass(ZoneClass)

module.exports = mongoose.model('Zone', schema)
