<template>
  <!--标签列表-->
  <div class="tab_list noselect" ref="tab_list">
    <div class="tab_item" v-for="(tab,tidx) in allTabs" :key="tidx" :style="tabStyle(tab)">
      <div
        class="tab_name"
        :style="tabNameStyle(tab,tidx)"
        @click="onChangeTab(tidx)"
      >
        {{tab.config.name}}
      </div>
      <div class="close_wrapper" @click="onCloseTab(tidx)">
        <span class="fa fa-close"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  data () {
    return {
    }
  },
  methods: {
    onCloseTab (tabIndex) {
      this.$store.dispatch('tabs/closeTab', tabIndex)
    },
    onChangeTab (tabIndex) {
      this.$store.dispatch('tabs/setTabActive', tabIndex)
    },
    tabStyle (tab) {
      let style = {}
      if (tab.active) {
        style['border-bottom'] = '1px solid #2d8cf0'
      }
      return style
    },
    tabNameStyle (tab) {
      let style = {}
      if (tab.active) {
        style['font-weight'] = 'bold'
      }
      return style
    }
  },
  mounted () {
  },
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
  .tab_list {
    max-width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;

    .tab_item {
      cursor: pointer;
      position: relative;
      background: #ffffff;
      width: 120px;
      height: 30px;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;

      .tab_name {
        flex-grow: 1;
        text-align: center;
        /*height: 100%;*/
        /*line-height: 100%;*/
      }

      .close_wrapper {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        flex-shrink: 0;

        &:hover {
          color: #2d8cf0;
        }
      }
    }
  }
</style>
