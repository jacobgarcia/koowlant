/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ZoneClass {
  // Methods
}

const schema = new Schema({
  name: String,
  positions: [[Number]],
  company: { type: Schema.Types.ObjectId, required: true, ref: 'Company' },
  subzones: [{ type: Schema.Types.ObjectId, ref: 'Subzone' }], // Id of the subzones that belong to this zone, if applicable
})

schema.loadClass(ZoneClass)

module.exports = mongoose.model('Zone', schema)
