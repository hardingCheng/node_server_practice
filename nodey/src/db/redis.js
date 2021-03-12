const redis = require('redis')
const { REDIS_CONFIG } = require('../conf/db')
// 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    redisClient.set(key, value, redis.print)
}

function get(key) {
    return new Promise((resolve,reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err)
                return
            }
            if (value == null) {
                resolve(null)
                return
            }
            try {
                resolve(JSON.parse(value))
            } catch (ex) {
                resolve(value)
            }
        })
    })
}
module.exports = {
    get,
    set
}
