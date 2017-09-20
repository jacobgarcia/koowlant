/* eslint-env node */
const express = require('express')
const winston = require('winston')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const path = require('path')

const User = require(path.resolve('models/User'))
const config = require(path.resolve('config/config'))

router.post('/authenticate', (req, res) => {
  const { email } = req.body

  let user

  User.findOne({ email })
  .then(foundUser => {
    if (foundUser === null) {
      winston.info('Failed to authenticate user')
      return res.status(401).json({ message: 'Authentication failed. Wrong user or password.' })
    }

    user = foundUser

    return bcrypt.compare(req.body.password + config.secret, user.password)
  })
  .then(success => {
    if (success === false) {
      winston.info('Failed to authenticate user')
      return res.status(401).json({ message: 'Authentication failed. Wrong user or password' })
    }

    const token = jwt.sign({
      _id: user._id,
      acc: user.accessLevel,
      cmp: user.company
    }, config.secret, { expiresIn: 604800 })

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        accessLevel: user.accessLevel,
      }
    })
  })
  .catch(error => {
    winston.error({error})
    return res.status(500).json({ error }) //Causes an error for cannot set headers after sent
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
