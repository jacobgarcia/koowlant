/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class GuestClass {
  // Methods
}

const schema = new Schema({
  email: String,
  company: String, // Company id
  GENERATED_VERIFYING_URL: String
})

schema.loadClass(GuestClass)

module.exports = mongoose.model('Guest', schema)
