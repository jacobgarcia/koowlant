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
    io.to('0293j4ji').emit('report',
    {
      site: 'A4050',
      zone: {
        name: 'Centro',
        _id: '4d128b6ea794fc13a8000001'
      },
      subzone: {
        name: 'C-Sur',
        _id: '4d1288sh2394fc13a8087301'
      },
      timestamp: Date.now(), // Unix timestamp
      sensors: [{
              key: "ts1",
              value: 28.5
      },{
              key: "ts2",
              value: 26.5
      },
      {
              key: "ts3",
              value: 21.5
      }],
      alarms: [{
          sensor: 'ts1', // Sensor id
          value: 60.5
      }]
    })
    io.to('0293j4ji').emit('report', {
      site: 'A23094',
      zone: {
        name: 'Norte',
        _id: '4d128b6ea794fc13a8000001'
      },
      subzone: {
        name: 'C-Sur',
        _id: '4d1288sh2394fc13a8087301'
      },
      timestamp: Date.now(), // Unix timestamp
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
  }, 12000)

  setTimeout(() => {
    setInterval(() => {
      io.to('0293j4ji').emit('report',
      {
        site: 'A4050',
        zone: {
          name: 'Centro',
          _id: '4d128b6ea794fc13a8000001'
        },
        subzone: {
          name: 'C-Sur',
          _id: '4d1288sh2394fc13a8087301'
        },
        timestamp: Date.now(), // Unix timestamp
        sensors: [{
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
        site: 'A23094',
        zone: {
          name: 'Centro',
          _id: '4d128b6ea794fc13a8000001'
        },
        subzone: {
          name: 'C-Sur',
          _id: '4d1288sh2394fc13a8087301'
        },
        timestamp: Date.now(), // Unix timestamp
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
            sensor: 'ts2', // Sensor id
            value: 50.5
        },{
            sensor: 'ts4', // Sensor id
            value: 60.5
        }]
      })
      io.to('0293j4ji').emit('report', {
        site: 'A23095',
        zone: {
          name: 'Centro',
          _id: '4d128b6ea794fc13a8000001'
        },
        subzone: {
          name: 'C-Norte',
          _id: '4d1223423494fc13a8087301'
        },
        timestamp: Date.now(), // Unix timestamp
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
        }]
      })
      io.to('0293j4ji').emit('report', {
        site: 'A23099',
        zone: {
          name: 'Centro',
          _id: '4d128b6ea794fc13a8000001'
        },
        subzone: {
          name: 'C-Norte',
          _id: '4d1223423494fc13a8087301'
        },
        timestamp: Date.now(), // Unix timestamp
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
        }]
      })
    }, 12000)
  }, 6000)
}

module.exports = sockets
