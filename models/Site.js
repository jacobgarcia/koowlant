/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {

}

const schema = new Schema({

})

schema.loadClass(SiteClass)

module.exports = mongoose.model('Zone', schema)
