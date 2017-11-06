/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class GuestClass {
  // Methods
}

const schema = new Schema({
  fullName: String,
  email: String,
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // Company id
  password: String,
  invitation_token: String,
  host: String // Email
})

schema.loadClass(GuestClass)

module.exports = mongoose.model('Guest', schema)
