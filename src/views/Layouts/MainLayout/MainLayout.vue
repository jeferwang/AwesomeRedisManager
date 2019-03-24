<template>
  <div class="main_layout" v-loading="loading">
    <Toolbar></Toolbar>
    <div class="page_main">
      <Left @start-connect="loading=true" @end-connect="loading=false"></Left>
      <Right>
        <Tabs></Tabs>
        <DataViews></DataViews>
      </Right>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Left from './components/Left'
import Right from './components/Right'
import Tabs from './components/Tabs'
import DataViews from './components/DataViews'

export default {
  name: 'MainLayout',
  data () {
    return {
      loading: false
    }
  },
  components: {
    Toolbar,
    Left,
    Right,
    Tabs,
    DataViews
  }
}
</script>

<style scoped lang="scss">
  .main_layout {
    display: flex;
    flex-direction: column;
    height: 100%;

    .page_main {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      height: 100%;
    }
  }
</style>
