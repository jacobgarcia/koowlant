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

// const mediaServerConfig = require(path.resolve('config/mediaServer'))
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


// RTMP Settings
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  https: {
    port: 8443,
    key:'/etc/letsencrypt/live/jenkins.kawlantid.com/privkey.pem',
    cert:'/etc/letsencrypt/live/jenkins.kawlantid.com/fullchain.pem',
  },
}
const nms = new NodeMediaServer(config)
nms.run()
