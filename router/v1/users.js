/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const mongoose = require('mongoose')
const nev = require('email-verification')(mongoose)

const Guest = require(path.resolve('models/Guest'))
const User = require(path.resolve('models/User'))

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

nev.configure({
  verificationURL: 'https://demo.kawlantid.com/signup/${URL}',

  // mongo configuration
  persistentUserModel: User,
  tempUserModel: Guest,
  expirationTime: 86400, //24 hour expiration
  URLFieldName: 'invitation_token',

  transportOptions: {
    service: 'Gmail',
    auth: {
        user: 'ingenieria@connus.mx',
        pass: 'kawlantcloud'
    }
  },
  verifyMailOptions: {
      from: 'Do Not Reply <ingenieria@connus.mx>',
      subject: 'Confirm your account',
      html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
              'paste the following link into your browser:</p><p>${URL}</p>',
      text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
  },
  shouldSendConfirmation: true,
  confirmMailOptions: {
      from: 'Do Not Reply <ingenieria@connus.mx>',
      subject: 'Successfully verified!',
      html: '<p>Your account has been successfully verified.</p>',
      text: 'Your account has been successfully verified.'
  },

  hashingFunction: null
}, (error, options) => {

})

router.route('/users/invite')
.post((req, res) => {
  const { email, company, host } = req.body

  const guest = new User({
    email,
    company,
    host
  })

  nev.createTempUser(guest, (err, existingPersistentUser, newTempUser) => {
    if (err) {
      winston.error({err})
      return res.status(500).json({ err })
    }
    if (existingPersistentUser) return res.status(409).json({error: 'User already registered'})

    if (newTempUser) {
      var URL = newTempUser[nev.options.URLFieldName]
      nev.sendVerificationEmail(email, URL, (error, info) => {
        if (error) return res.status(500).json({error})
        else return res.status(200).json({message: 'Invitation successfully sent'})
       })
    }
    // user already have been invited
    else return res.status(409).json({error: 'User already invited'})
  })

})

router.route('/users/self')
.get((req, res) => {
  // Get user id by its
  User.findById(req._user._id)
  .select('-password')
  .populate('company', '_id logo name')
  .lean()
  .exec((error, user) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!user) return res.status(404).json({ error: { message: 'User not found' } })
    console.log({user})

    return res.status(200).json({
      user
    })
  })
})

module.exports = router
