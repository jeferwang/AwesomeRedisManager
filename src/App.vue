<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  mounted () {
    // 启动后加载配置数据
    this.$store.dispatch('redisConfig/readConfigs')
  }
}
</script>

<style lang="scss" scoped>
</style>
