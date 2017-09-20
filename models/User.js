/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class UserClass {
  // Methods
}

const schema = new Schema({
  fullName: String,
  email: String,
  company: String, // Company id
  password: String
})

schema.loadClass(UserClass)

module.exports = mongoose.model('User', schema)
