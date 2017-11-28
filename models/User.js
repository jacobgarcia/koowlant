/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class UserClass {
  // Methods
}

const schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // Company id
  password: String,
  host: String,
  access: Number,
  name: String,
  surname: String,
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  subzone: { type: Schema.Types.ObjectId, ref: 'Subzone' },
  // TODO add this
  subzones: [{ type: Schema.Types.ObjectId, ref: 'Subzone' }],
  zones: [{ type: Schema.Types.ObjectId, ref: 'Zone' }],
})

schema.virtual('fullName').get(function() {
  return this.name + ' ' + this.surname
})

schema.loadClass(UserClass)

module.exports = mongoose.model('User', schema)
