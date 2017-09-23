/* eslint-env node */
const winston = require('winston')

function sockets(io) {
  io.on('connection', socket => {
    winston.info('New client connection')
    // TODO: Validate thru JWT

    socket.on('join', companyId => {
      winston.info('New join on room: ' + companyId)
      socket.join(companyId)
    })

    socket.on('hello', message => {
      winston.debug('Hello message: ' + message)

    })
  })

  setInterval(() => {
    io.emit('report', 'everyone')
    io.to('0293j4ji').emit('report',
    {
      "site": "A4050",
      "timestamp": 1505495552211, // Unix timestamp
      "sensors": [{
              key: "ts1",
              "value": 28.5
      },{
              key: "ts2",
              "value": 26.5
      },
      {
              key: "ts3",
              "value": 21.5
      }],
      alarms: [{
          "sensor": "ts1", // Sensor id
          "value": 60.5
      }]
    })
    io.to('0293j4ji').emit('report', {
      site: "A23096",
      timestamp: 1505495552211, // Unix timestamp
      sensors: [{
              key: "ts1",
              value: 28.5
      },{
              key: "ts2",
              "value": 26.5
      },
      {
              key: "ts3",
              "value": 21.5
      },{
              key: "ts4",
              "value": 20.5
      },{
              key: "ts5",
              "value": 26.5
      }]
    })
  }, 3000)



  setTimeout(() => {
    setInterval(() => {
      io.emit('report', 'everyone')
      io.to('0293j4ji').emit('report',
      {
        "site": "A4050",
        "timestamp": 1505495552211, // Unix timestamp
        "sensors": [{
                key: "ts1",
                "value": 29.5
        },{
                key: "ts2",
                "value": 25.5
        },
        {
                key: "ts3",
                "value": 23.5
        }]
      })
      io.to('0293j4ji').emit('report', {
        site: "A23096",
        timestamp: 1505495552211, // Unix timestamp
        sensors: [{
                key: "ts1",
                value: 21.5
        },{
                key: "ts2",
                "value": 23.5
        },{
                key: "ts3",
                "value": 25.5
        },{
                key: "ts4",
                "value": 22.5
        },{
                key: "ts5",
                "value": 21.5
        }],
        alarms: [{
            "sensor": "ts2", // Sensor id
            "value": 50.5
        },{
            "sensor": "ts4", // Sensor id
            "value": 60.5
        }]
      })
    }, 3000)
  }, 1500)
}

module.exports = sockets
