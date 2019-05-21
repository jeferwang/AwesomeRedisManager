export const Storage = {
  local: {
    set (key, value) {
      if (typeof key !== 'string') {
        throw new Error('Key must be string')
      }
      localStorage.setItem(key, JSON.stringify(value))
    },
    get (key, value) {
      if (typeof key !== 'string') {
        throw new Error('Key must be string')
      }
      const res = localStorage.getItem(key)
      if (res === null) {
        return null
      } else {
        return JSON.parse(res)
      }
    },
    remove (key) {
      if (typeof key !== 'string') {
        throw new Error('Key must be string')
      }
      localStorage.removeItem(key)
    }
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$storage = Storage
  }
}
