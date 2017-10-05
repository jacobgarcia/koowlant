/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class GuestClass {
  // Methods
}

const schema = new Schema({
  email: String,
  company: String, // Company id
  GENERATED_VERIFYING_URL: String,
  createdAt: {
      type: Date,
      expires: 86400,
      default: Date.now
  }
})

schema.loadClass(GuestClass)

module.exports = mongoose.model('Guest', schema)
