const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)
redisClient.on('error', err => {
  console.error(err)
})

// 设置
const set = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}
// 查询
const get = (key) => {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return 
      }
      if (val === null) {
        resolve(null)
        return 
      }
      try {
        resolve(JSON.parse(val))
      } catch (e) {
        resolve(val)
      }
    })
  })
  return promise
}
module.exports = {
  set,
  get
}