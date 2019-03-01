<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import Redis from 'ioredis'
// import electron from 'electron'
// import fs from 'fs'
// import path from 'path'

export default {
  name: 'App',
  components: {},
  mounted () {
    // const client = new Redis('127.0.0.1', 6379)
    // client.set('name', 'jeferwang111')
    // const udPath = (electron.app || electron.remote.app).getPath('userData')
    // const confPath = path.join(udPath, 'config')
    // !fs.existsSync(confPath) && fs.mkdirSync(confPath)
    // fs.writeFileSync(`${confPath}/config.json`, JSON.stringify({ a: 1 }, null, '  '))
  }
}
</script>

<style lang="scss" scoped>
</style>
