<template>
  <!--标签列表-->
  <div class="tabs" v-show="allTabs.length">
    <div class="mask_left" v-show="showLeft"></div>
    <div class="tab_list no-select" ref="tab_list" @mousewheel="onTabScroll">
      <div class="tab_item" v-for="(tab,tidx) in allTabs" :key="tidx" :class="{active:tab.active}">
        <div
          class="tab_name"
          @click="onChangeTab(tidx)"
        >
          {{tab.config.name}}
        </div>
        <div class="close_wrapper" @click="onCloseTab(tidx)">
          <span class="fa fa-close"></span>
        </div>
      </div>
    </div>
    <div class="mask_right" v-show="showRight"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  data () {
    return {
      showLeft: false,
      showRight: false
    }
  },
  methods: {
    onTabScroll (event) {
      var detail = event.wheelDelta || event.detail
      var moveForwardStep = -0.2
      var moveBackStep = 0.2
      var step = 0
      if (detail > 0) {
        step = moveForwardStep * 100
      } else {
        step = moveBackStep * 100
      }
      this.$refs.tab_list.scrollLeft += step
      this.getScrollInfo()
    },
    onCloseTab (tabIndex) {
      this.$store.dispatch('tabs/closeTab', tabIndex)
    },
    onChangeTab (tabIndex) {
      this.$store.dispatch('tabs/setTabActive', tabIndex)
    },
    getScrollInfo () {
      let t = this.$refs.tab_list
      if (t.scrollWidth <= t.offsetWidth) {
        this.showLeft = false
        this.showRight = false
      } else {
        if (t.scrollLeft === 0) {
          this.showLeft = false
          this.showRight = true
        } else if (parseInt(t.scrollLeft + t.offsetWidth) === t.scrollWidth) {
          this.showLeft = true
          this.showRight = false
        } else {
          this.showLeft = true
          this.showRight = true
        }
      }
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
  },
  watch: {
    allTabs () {
      this.getScrollInfo()
    }
  }
}
</script>

<style scoped lang="scss">
  .tabs {
    position: relative;

    .mask_left {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0;
      height: $grid-height-normal;
      width: 20px;
      background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    }

    .mask_right {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 0;
      height: $grid-height-normal;
      width: 20px;
      background: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    }
  }

  .tab_list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    color: $text-color-normal;
    overflow: hidden;
    overflow-x: scroll;
    border-bottom: 1px solid $border-color;

    &::-webkit-scrollbar {
      display: none
    }

    .tab_item {
      cursor: pointer;
      position: relative;
      background: $background-color;
      width: 180px;
      height: $grid-height-normal;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-right: 1px solid $border-color;
      // border-bottom: 1px solid $border-color;

      &.active {
        border-bottom: 1px solid $background-color-highlight-blue;
        background: $background-color-highlight-blue;
      }

      .tab_name {
        flex-grow: 1;
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        text-align: center;
      }

      .close_wrapper {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        flex-shrink: 0;

        &:hover {
          color: $text-color-light;
        }
      }
    }
  }
</style>
