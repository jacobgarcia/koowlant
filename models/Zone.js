/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class ZoneClass {

}

const schema = new Schema({

})

schema.loadClass(ZoneClass)

module.exports = mongoose.model('Zone', schema)
