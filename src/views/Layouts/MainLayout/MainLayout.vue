<template>
  <div class="main_layout">
    <Toolbar></Toolbar>
    <div class="page_main">
      <Left></Left>
      <Right></Right>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Left from './components/Left'
import Right from './components/Right'

export default {
  name: 'MainLayout',
  components: {
    Toolbar,
    Left,
    Right
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
