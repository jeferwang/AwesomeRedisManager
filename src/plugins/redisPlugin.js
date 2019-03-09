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

export default {
  redisConfigPath,
  readRedisConfig,
  writeRedisConfig,
  install (Vue, options) {
    Vue.prototype.$redisConfigPath = redisConfigPath
  }
}
