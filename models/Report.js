/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ReportClass {

}

const schema = new Schema({

})

schema.loadClass(ReportClass)

module.exports = mongoose.model('Zone', schema)
