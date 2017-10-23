/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class UserClass {
  // Methods
}

const schema = new Schema({
  email: String,
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // Company id
  password: String,
  host: String,
  accessLevel: String,
  name: String,
  surname: String
})

schema.virtual('fullName').get(function() {
  return this.name + ' ' + this.surname
})

schema.loadClass(UserClass)

module.exports = mongoose.model('User', schema)
