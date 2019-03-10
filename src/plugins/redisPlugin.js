import Redis from 'ioredis'
import electronPlugin from './electronPlugin'
import fs from 'fs'

export const redisConfigPath = `${electronPlugin.getConfigPath()}/redisConfig.json`

export function readRedisConfig () {
  return new Promise((resolve, reject) => {
    fs.access(redisConfigPath, function (err) {
      if (err) {
        return reject(err)
      }
      fs.readFile(redisConfigPath, (err, data) => {
        if (err) {
          return reject(err)
        }
        try {
          data = JSON.parse(data)
          if (!data) {
            data = []
          }
          return resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    })
  })
}

export function writeRedisConfig (configList) {
  return new Promise((resolve, reject) => {
    fs.writeFile(redisConfigPath, JSON.stringify(configList, null, '  '), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function connectRedis (config) {
  return new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    maxRetriesPerRequest: 0,
    reconnectOnError: function (e) {
      return 0
    }
  })
}

export default {
  redisConfigPath,
  readRedisConfig,
  writeRedisConfig,
  connectRedis,
  install (Vue, options) {
    Vue.prototype.$redisConfigPath = redisConfigPath
    Vue.prototype.$connectRedis = connectRedis
  }
}
