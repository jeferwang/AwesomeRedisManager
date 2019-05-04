import crypto from 'crypto'

export const sha1 = (str) => {
  let shaHandler = crypto.createHash('sha1')
  shaHandler.update(str)
  return shaHandler.digest('hex')
}

export default {
  install (Vue, options) {
    Vue.prototype.$hash = {}
    Vue.prototype.$hash.sha1 = sha1
  }
}
