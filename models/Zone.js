/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ZoneClass {
  // Methods
}

const schema = new Schema({
  name: {type: String, required: true},
  positions: {
    type: [[Number]],
    required: true
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  subzones: [{ type: Schema.Types.ObjectId, ref: 'Subzone', default: [] }], // Id of the subzones that belong to this zone, if applicable
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

schema.loadClass(ZoneClass)

module.exports = mongoose.model('Zone', schema)
