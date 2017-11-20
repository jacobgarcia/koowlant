/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection

const bodyParser = require('body-parser')
const compression = require('compression') // Files compresion
const winston = require('winston') // Logger
const v1 = require(path.resolve('router/v1'))
const cors = require('cors')
const app = express()

const mediaServerConfig = require(path.resolve('config/mediaServer'))
const webpackDevServer = require(path.resolve('config/webpackDevServer')) // Dev server

const PORT = process.env.PORT || 8080
const NodeMediaServer = require('node-media-server')

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function shouldCompress(req, res) {
  return req.headers['x-no-compression'] ? false : compression.filter(req, res)
}

// Compression
app.use(compression({filter: shouldCompress}))

// If in development use webpackDevServer
process.env.NODE_ENV === 'development'
&& app.use(webpackDevServer)

// Images and static assets
app.use('/static',
  express.static(path.resolve('static'))
)

// Bundles
app.use('/dist',
  express.static('dist')
)

// TODO add API
if (process.env.NODE_ENV === 'development') {
  winston.info('DEVELOPMENT')
  app.use(cors())
}
// Resolve API v1
app.use('/v1', v1)

// Send index to all other routes
app.get('*', (req, res) =>
  res.sendFile(path.resolve('src/index.html'))
)

// Run media server
new NodeMediaServer(mediaServerConfig).run()

// Start server
const server = app.listen(PORT, () =>
  winston.info(`KawlantID server is listening on port: ${PORT}!`)
)

const io = require('socket.io').listen(server)

// Connect sockets
require(path.resolve('router/v1/sockets'))(io)
