/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SubzoneClass {
  // Methods
}

const schema = new Schema({
  name: String,
  positions: [[Number]],
  company: { type: Schema.Types.ObjectId, required: true, ref: 'Company' },
  parentZone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  sites: [{ type: Schema.Types.ObjectId, ref: 'Site' }]
})

schema.loadClass(SubzoneClass)

module.exports = mongoose.model('Subzone', schema)
