<template>
  <div class="data_view_main">
    <div class="left">
      <div class="search_box">
        <div class="tip">筛选Key</div>
        <input
          type="text"
          class="com-input"
          placeholder="输入筛选表达式"
          v-model="mainMatch"
          @input="onInputKeyCondition"
        >
      </div>
      <!--<div class="db_selector">-->
      <!--<Select v-model="currDb" @on-change="onChangeDb" size="small">-->
      <!--<Option v-for="dbi in dbNum" :value="dbi-1" :key="dbi-1">DB{{ dbi-1 }}</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <div class="key_list" @scroll="onScrollKeyList">
        <div class="key_item" v-for="mainKey in mainKeyList" :key="mainKey">{{mainKey}}</div>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataView',
  components: {},
  props: {
    tab: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      connect: null,
      dbNum: 0,
      currDb: 0,
      mainKeyList: [],
      mainCursor: 0,
      mainMatch: '',
      hasMore: true
    }
  },
  methods: {
    // 输入内容变化的时候，即时刷新
    async onInputKeyCondition () {
      this.loadDbKeys({ reload: true })
    },
    // 加载当前选择的数据库中的key
    async loadDbKeys ({ reload = false } = {}) {
      if (this.loading || !this.hasMore) {
        return false
      }
      this.loading = true
      if (reload) {
        this.mainKeyList = []
        this.mainCursor = 0
      }
      let extParams = ['count', 100]
      if (this.mainMatch.length) {
        extParams.push(...['match', this.mainMatch])
      }
      let res = await this.connect.scan(this.mainCursor, ...extParams)
      this.mainCursor = ~~res[0]
      if (this.mainCursor === 0) {
        this.hasMore = false
      }
      this.mainKeyList.push(...res[1])
      this.loading = false

      // for (let i = 0; i < 500; i++) {
      //   await this.connect.set(`demoKey_${i}`, i)
      // }
    },
    // 执行切换数据库
    async changeDb (dbIndex) {
      // 修改数据库
      await this.connect.select(dbIndex)
      // 刷新数据
      await this.loadDbKeys({ reload: true })
    },
    // 修改下拉框切换数据库
    async onChangeDb (newDb) {
      if (newDb >= 0 && newDb < this.dbNum) {
        this.changeDb(newDb)
      }
    },
    onScrollKeyList (e) {
      let sHeight = e.target.scrollHeight
      let boxHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (sHeight - (boxHeight + scrollTop) < 20) {
        this.loadDbKeys()
      }
    }
  },
  async mounted () {
    // 读取数据库的数量
    this.connect = this.tab.connect
    let dbNum = await this.tab.connect.config('get', 'databases')
    this.dbNum = ~~dbNum[1]
    // 页面数据初始化操作
    this.changeDb(0)
  },
  async created () {

  },
  computed: {
    ...mapGetters('tabs', [
      'allTabs'
    ])
  }
}
</script>

<style scoped lang="scss">

  .data_view_main {
    height: 100%;

    .left {
      height: 100%;
      width: 20vw;
      box-sizing: border-box;
      border-right: 1px solid $border-color;

      .search_box {
        display: flex;
        flex-direction: row;
        font-size: 14px;

        .tip {
          background: $background-color-dark;
          line-height: $grid-height-normal;
          padding: 0 10px;
        }

        .com-input {
          flex-grow: 1;
          height: $grid-height-normal;
          padding: 0 10px;
        }
      }

      .key_list {
        height: calc(100% - #{$grid-height-normal});
        overflow: hidden;
        overflow-y: auto;

        .key_item {
          height: $grid-height-normal;
          line-height: $grid-height-normal;
          padding-left: 10px;
          box-sizing: border-box;
          border-bottom: 1px solid $border-color;
          cursor: pointer;

          &:hover {
            background: $background-color-highlight-blue;
          }
        }
      }
    }
  }
</style>
