/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SubzoneClass {
  // Methods
}

const schema = new Schema({
  name: String,
  positions: {
    type: [[Number]],
    required: true
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  parentZone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  sites: [{ type: Schema.Types.ObjectId, ref: 'Site' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

schema.loadClass(SubzoneClass)

module.exports = mongoose.model('Subzone', schema)
