const config = {
  'secret': 'sUp3-rS.ecr3t{pass}',
  'database': process.env.MONGODB_URL || 'mongodb://localhost:27017/telco'
}

module.exports = config
