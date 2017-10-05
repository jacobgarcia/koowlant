/* eslint-env node */
const express = require('express')
const winston = require('winston')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const path = require('path')
const mongoose = require('mongoose')
const nev = require('email-verification')(mongoose)

const User = require(path.resolve('models/User'))
const Guest = require(path.resolve('models/Guest'))

const config = require(path.resolve('config/config'))

nev.configure({
  verificationURL: 'http://localhost:8080/authenticate/${URL}',

  // mongo configuration
  persistentUserModel: User,
  tempUserModel: Guest,
  expirationTime: 86400, //24 hour expiration
  URLFieldName: 'token',

  transportOptions: {
    service: 'Gmail',
    auth: {
        user: 'fatalraincloud@gmail.com',
        pass: '98JARPIHn4eb'
    }
  },
  verifyMailOptions: {
      from: 'Do Not Reply <fatalraincloud@gmail.com>',
      subject: 'Confirm your account',
      html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
              'paste the following link into your browser:</p><p>${URL}</p>',
      text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
  },
  shouldSendConfirmation: true,
  confirmMailOptions: {
      from: 'Do Not Reply <fatalraincloud@gmail.com>',
      subject: 'Successfully verified!',
      html: '<p>Your account has been successfully verified.</p>',
      text: 'Your account has been successfully verified.'
  },

  hashingFunction: null
}, (error, options) => {

})

router.post('/signup/:token', (req, res) => {
  const token = req.params.token
  const { email, password, fullName } = req.body

  if (!token) return res.status(401).json({ message: 'No invitation token provided'})
  Guest.findOne({ token })
  .exec((error, guest) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }
    else if (!guest) return res.status(401).json({ message: 'Invalid invitation. Please ask your administrator to send your invitation again'})
    else if (guest.email != email) return res.status(401).json({ message: 'Invalid invitation. Please ask your administrator to send your invitation again'})
    else {
      guest.fullName = fullName

      guest.password = bcrypt.hashSync(password)

      guest.save((error, guest) => {
        nev.confirmTempUser(token, (error, user) => {
            if (error) {
              winston.error(error)
              return res.status(500).json({error})
            }
            else if (user) {
              nev.sendConfirmationEmail(user.email, (error, info) => {
                if (error) {
                  winston.error(error)
                  return res.status(404).json({ message: 'Sending confirmation email FAILED'})
                }
                return res.status(200).json({ message: 'Sent confirmation email!', info })
              })
            }
            else return res.status(500).json({ message: 'Could not send create user information' })
        })
    })
  }
})


})
router.post('/authenticate', (req, res) => {
  const { email } = req.body

  User.findOne({ email })
  .then(user => {
    if (user === null) {
      winston.info('Failed to authenticate user email')
      return res.status(401).json({ message: 'Authentication failed. Wrong user or password.' })
    }

    return bcrypt.compare(req.body.password + config.secret, user.password)
    .then(success => {
      if (success === false) {
        winston.info('Failed to authenticate user password')
        return res.status(401).json({ message: 'Authentication failed. Wrong user or password' })
      }

      const token = jwt.sign({
        _id: user._id,
        acc: user.accessLevel,
        cmp: user.company
      }, config.secret)

      user = user.toObject()

      return res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name || 'User',
          surname: user.surname,
          accessLevel: user.accessLevel
        }
      })
    })
  })
  .catch(error => {
    winston.error({error})
    return res.status(500).json({ error }) // Causes an error for cannot set headers after sent
  })
})

router.use((req, res, next) => {
  const bearer = req.headers.authorization || 'Bearer '
  const token = bearer.split(' ')[1]

  if (!token) {
    return res.status(401).send({ error: { message: 'No token provided' } })
  }

  return jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: { message: 'Failed to authenticate token' }})
    }
    req._user = decoded
    return next()
  })
})

module.exports = router
