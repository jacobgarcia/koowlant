/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SubzoneClass {
  // Methods
}

const schema = new Schema({
  positions: [[Number]],
  name: String,
  parentZone: { type: mongoose.schema.objectId, ref: 'Zone' },
  sites: [{ type: mongoose.schema.objectId, ref: 'Site' }]
})

schema.loadClass(SubzoneClass)

module.exports = mongoose.model('Subzone', schema)
