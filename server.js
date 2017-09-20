/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const compression = require('compression')
const winston = require('winston')
const app = express()
const v1 = require(path.resolve('router/v1'))

const PORT = process.env.PORT || 8080

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function shouldCompress(req, res) {
  return req.headers['x-no-compression'] ? false : compression.filter(req, res)
}

// Compression
app.use(compression({filter: shouldCompress}))

app.use(
  '/static',
  express.static(path.resolve('static'))
)
app.use(
  '/dist',
  express.static('dist')
)

// Resolve API v1
app.use('/v1', v1)

// Send index to all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve('src/index.html'))
})

// Start server
const server = app.listen(PORT, () =>
  winston.info(`Telco server is listening on port: ${PORT}!`)
)

const io = require('socket.io').listen(server)

// Connect sockets
require(path.resolve('router/v1/sockets'))(io)
