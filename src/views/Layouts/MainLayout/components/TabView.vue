<template>
  <div class="data_view_main">
    <div class="left">
      <div class="search_box">
        <div class="tip noselect">筛选 DB Key</div>
        <input
          type="text"
          class="com-input"
          placeholder="输入筛选表达式"
          v-model="mainMatch"
          @input="onInputKeyCondition"
          @keydown.esc="onCleanKeyCondition"
        >
      </div>
      <!--todo 选择db功能-->
      <!--<div class="db_selector">-->
      <!--<Select v-model="currDb" @on-change="onChangeDb" size="small">-->
      <!--<Option v-for="dbi in dbNum" :value="dbi-1" :key="dbi-1">DB{{ dbi-1 }}</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <div
        class="key_list noselect"
        @scroll="onScrollKeyList"
      >
        <div
          class="key_item"
          v-for="(mainKey,mkIdx) in mainKeyList"
          :key="mkIdx"
          @click="onShowDetail(mainKey,mkIdx)"
        >
          {{mainKey}}
        </div>
      </div>
    </div>
    <div class="right">
      <DataView
        v-if="detail.show"
        :tab="tab"
        :main-key="detail.key"
        @delete-key="onDeleteCurrent"
        @rename-key="onRenameCurrent"
      ></DataView>
    </div>
  </div>
</template>

<script>
import DataView from './DataView'
import { mapGetters } from 'vuex'

export default {
  name: 'TabView',
  components: {
    DataView
  },
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
      hasMore: true,
      // 查看详情相关参数
      detail: {
        show: false,
        key: null,
        idx: -1
      }
    }
  },
  methods: {
    async onCleanKeyCondition () {
      this.mainMatch = ''
      this.loadDbKeys({ reload: true })
    },
    async renameKey (oldKey, newKey, index) {
      console.log('执行重命名', oldKey, newKey, index)
      try {
        await this.tab.connect.rename(oldKey, newKey)
      } catch (e) {
        console.error(e)
        if (e.message.includes('no such key')) {
          this.$msg.msgBox({ msg: '重命名的Key不存在', type: 'warning' })
        }
        return false
      }
      // 修改列表
      this.mainKeyList[index] = newKey
      this.$msg.msgBox({ msg: '重命名成功', type: 'success' })
    },
    async onRenameCurrent (e) {
      await this.renameKey(e.oldKey, e.newKey, this.detail.idx)
      this.detail.key = e.newKey
    },
    // 执行删除的函数
    async deleteKey (key, index) {
      console.log('执行删除', key, index)
      await this.tab.connect.del(key)
      this.mainKeyList.splice(index, 1)
      this.$msg.msgBox({ msg: '删除成功', type: 'success' })
    },
    // 收到子组件的删除事件
    async onDeleteCurrent () {
      await this.deleteKey(this.detail.key, this.detail.index)
      this.hideDetail()
    },
    // 隐藏详情
    hideDetail () {
      this.detail.key = null
      this.detail.idx = -1
      this.detail.show = false
    },
    // 点击查看Key的数据
    onShowDetail (mainKey, idx) {
      this.detail.key = `${mainKey}` // rename告诉DataView组件watch的时候是否需要重新初始化信息
      this.detail.idx = idx
      this.detail.show = true
    },
    // 输入内容变化的时候，即时刷新
    async onInputKeyCondition () {
      this.loadDbKeys({ reload: true })
    },
    // 加载当前选择的数据库中的key
    async loadDbKeys ({ reload = false } = {}) {
      if (this.loading) {
        return false
      }
      if (!this.hasMore && !reload) {
        return false
      }
      if (reload) {
        this.mainKeyList = []
        this.mainCursor = 0
        this.hasMore = true
      }
      this.loading = true
      let extParams = ['count', 100]
      if (this.mainMatch.length) {
        extParams.push(...['match', `*${this.mainMatch}*`])
      }
      let res
      let cursor = this.mainCursor
      while (true) {
        res = await this.connect.scan(cursor, ...extParams)
        cursor = parseInt(res[0])
        if (res[1] && res[1].length) {
          this.mainKeyList.push(...res[1])
        }
        if (parseInt(res[0]) === 0 || this.mainKeyList.length > 1000) {
          // 到结尾
          break
        }
      }
      this.mainCursor = cursor
      if (this.mainCursor === 0) {
        this.hasMore = false
      }
      this.loading = false
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
    // for (let i = 0; i < 20; i++) {
    //   for (let j = 0; j < 1000; j++) {
    //     console.log(i, j)
    //     await this.tab.connect.rpush(`list_${i}`, `list_${i}_${j}`)
    //   }
    // }
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
  display: flex;

  .left {
    height: 100%;
    width: 20vw;
    box-sizing: border-box;
    border-right: 1px solid $border-color;

    .search_box {
      display: flex;
      flex-direction: row;
      // font-size: 14px;

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
  .right {
    height: 100%;
    width: 60vw;
    box-sizing: border-box;
  }
}
</style>
