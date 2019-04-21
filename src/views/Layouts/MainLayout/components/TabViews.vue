<template>
  <div>
    <TabView v-for="tab in allTabs" :key="tab.markId" v-show="tab.active" :tab="tab"></TabView>
  </div>
</template>

<script>
import TabView from './TabView'
import { mapGetters } from 'vuex'

export default {
  name: 'TabViews',
  components: {
    TabView
  },
  data () {
    return {}
  },
  methods: {},
  created () {
  },
  computed: {
    ...mapGetters('tabs', [
      'allTabs'
    ])
  }
}
</script>

<style scoped lang="scss">
</style>
