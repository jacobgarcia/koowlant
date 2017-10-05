/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class GuestClass {
  // Methods
}

const schema = new Schema({
  fullName: String,
  email: String,
  company: String, // Company id
  password: String,
  token: String
})

schema.loadClass(GuestClass)

module.exports = mongoose.model('Guest', schema)
