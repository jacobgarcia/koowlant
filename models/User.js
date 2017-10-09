/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class UserClass {
  // Methods
}

const schema = new Schema({
  fullName: String,
  email: String,
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // Company id
  password: String,
  host: String,
  accessLevel: String
})

schema.loadClass(UserClass)

module.exports = mongoose.model('User', schema)
