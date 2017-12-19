/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection

const bodyParser = require('body-parser')
const compression = require('compression') // Files compresion
const winston = require('winston') // Logger
const v1 = require(path.resolve('router/v1'))
const NodeMediaServer = require('node-media-server')
const cors = require('cors')
const app = express()

let mediaServerConfig = { }
if (process.env.NODE_ENV === 'development')
  mediaServerConfig = require(path.resolve('config/mediaDevServer'))
else
  mediaServerConfig = require(path.resolve('config/mediaServer'))

const webpackDevServer = require(path.resolve('config/webpackDevServer')) // Dev server

const PORT = process.env.PORT || 8080

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function shouldCompress(req, res) {
  return req.headers['x-no-compression'] ? false : compression.filter(req, res)
}

// Compression
app.use(compression({filter: shouldCompress}))

// Images and static assets
app.use('/static',
  express.static(path.resolve('static'))
)

// Bundles
app.use('/dist',
  express.static('dist')
)

// Development
if (process.env.NODE_ENV === 'development') {
  app.use(webpackDevServer)
  app.use(cors())
}

// Resolve API v1
app.use('/v1', v1)

// Send index to all other routes
app.get('*', (req, res) =>
  res.sendFile(path.resolve('src/index.html'))
)

// Start server
const server = app.listen(PORT, () =>
  winston.info(`KawlantID server is listening on port: ${PORT}!`)
)

const io = require('socket.io').listen(server)
// io.set('origins', '*')
// Connect sockets
require(path.resolve('router/v1/sockets'))(io)

const nms = new NodeMediaServer(mediaServerConfig)
nms.run()
