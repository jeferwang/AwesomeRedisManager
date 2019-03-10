export const Storage = {
  local: {
    set (key, value) {
      if (typeof key !== 'string') {
        throw new Error('Key只能为字符串')
      }
      localStorage.setItem(key, JSON.stringify(value))
    },
    get (key, value) {
      if (typeof key !== 'string') {
        throw new Error('Key只能为字符串')
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
        throw new Error('Key只能为字符串')
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
