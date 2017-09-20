/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class CompanyClass {
  // Methods
}

const schema = new Schema({
  logo: String, // Url
  name: String,
  employees: [] // User id
})

schema.loadClass(CompanyClass)

module.exports = mongoose.model('Company', schema)
