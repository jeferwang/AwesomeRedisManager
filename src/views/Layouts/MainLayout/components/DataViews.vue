<template>
  <div>
    <DataView v-for="(tab,tidx) in allTabs" :key="tidx" v-show="tab.active" :tab="tab"></DataView>
  </div>
</template>

<script>
import DataView from './DataView'
import { mapGetters } from 'vuex'

export default {
  name: 'DataViews',
  components: {
    DataView
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
