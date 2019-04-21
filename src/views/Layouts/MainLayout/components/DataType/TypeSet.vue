<template>
  <div class="main_box">
    <div class="title">
      <div class="title_text">Set Data</div>
    </div>
    <div class="data_box">
      <div class="list_box">
        <div class="search_box">
          <input
            type="text"
            class="com-input"
            v-model="match"
            @input="onInputCondition"
            @keydown.esc="onClearCondition"
          >
          <div class="add_btn" @click="showAddDialog=true">
            <i class="fa fa-plus"></i>
            <span> Add Items</span>
          </div>
        </div>
        <div
          class="val_list no-select"
          @scroll="onScrollDataList"
        >
          <div
            class="val_item"
            v-for="(val,idx) in dataList"
            :key="idx"
            @click="onShowDetail(val,idx)"
          >
            {{val}}
          </div>
        </div>
      </div>
      <div
        class="val_detail_box"
        v-if="detail.oldVal.length"
      >
        <div class="val_box">
          <textarea class="com-input" v-model="detail.newVal"></textarea>
          <div class="opt_group">
            <div
              class="com-btn com-btn-warning"
              @click="onFormat"
            >
              格式化
            </div>
            <div
              class="com-btn com-btn-success"
              @click="onSave"
            >
              保存
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateMainKey
      v-if="showAddDialog"
      :tab="tab"
      :lock-key="mainKey"
      lock-type="set"
      @close="showAddDialog=false"
      @save="onAddDataComplete"
    ></CreateMainKey>
  </div>
</template>

<script>
import CreateMainKey from '../Dialog/CreateMainKey'

export default {
  name: 'TypeSet',
  components: {
    CreateMainKey
  },
  props: {
    tab: {
      type: Object,
      default: null
    },
    mainKey: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showAddDialog: false,
      loading: false,
      hasMore: true,
      dataList: [],
      cursor: 0,
      match: '',
      detail: {
        oldVal: '',
        newVal: '',
        idx: -1
      }
    }
  },
  methods: {
    onAddDataComplete () {
      this.showAddDialog = false
      this.initData()
    },
    async onSave () {
      if (this.detail.oldVal === this.detail.newVal) {
        return false
      }
      try {
        // 移除旧的
        await this.tab.connect.srem(this.mainKey, this.detail.oldVal)
        // 添加新的
        await this.tab.connect.sadd(this.mainKey, this.detail.newVal)
        this.$set(this.dataList, this.detail.idx, this.detail.newVal)
        this.detail.oldVal = this.detail.newVal
        this.$msg.msgBox({ msg: '保存成功', type: 'success', duration: 1000 })
      } catch (e) {
        this.$msg.msgBox({ msg: '保存失败', type: 'warning', duration: 1000 })
        console.warn(e)
        return false
      }
    },
    onFormat () {
      if (!this.detail.newVal || this.detail.newVal === this.detail.oldVal) {
        return false
      }
      let val = null
      this.$popup.actionList({ actionList: ['XML', 'JSON'], tipText: '请选择格式' })
        .then(res => {
          switch (res.action) {
            case 'XML':
              val = this.$formatXML(this.detail.newVal)
              break
            case 'JSON':
              val = this.$formatJSON(this.detail.newVal)
              break
          }
          if (!val || !val.length) {
            // 报错提示
            this.$msg.msgBox({ msg: '格式化失败', type: 'warning' })
            return false
          }
          this.$msg.msgBox({ msg: '格式化完成', type: 'success', duration: 1000 })
          this.detail.newVal = val
        })
    },
    async onShowDetail (val, idx) {
      this.detail.oldVal = val
      this.detail.newVal = val
      this.detail.idx = idx
    },
    async onClearCondition () {
      this.match = ''
      this.loadData({ reload: true })
    },
    async onInputCondition () {
      this.loadData({ reload: true })
    },
    async onScrollDataList (e) {
      let sHeight = e.target.scrollHeight
      let boxHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (sHeight - (boxHeight + scrollTop) < 20) {
        this.loadData()
      }
    },
    async loadData ({ reload = false } = {}) {
      if (this.loading) {
        return false
      }
      if (!this.hasMore && !reload) {
        return false
      }
      if (reload) {
        this.dataList = []
        this.cursor = 0
        this.hasMore = true
      }
      this.loading = true
      let extParams = ['count', 100]
      if (this.match.length) {
        extParams.push(...['match', `*${this.match}*`])
      }
      let res
      let cursor = this.cursor
      while (true) {
        res = await this.tab.connect.sscan(this.mainKey, cursor, ...extParams)
        cursor = parseInt(res[0])
        if (res[1] && res[1].length) {
          this.dataList.push(...res[1])
        }
        if (parseInt(res[0]) === 0 || this.dataList.length > 100) {
          // 到结尾或者拿到了想要的数量
          break
        }
      }
      this.cursor = cursor
      if (this.cursor === 0) {
        this.hasMore = false
      }
      this.loading = false
    },
    async initData () {
      this.detail = {
        oldVal: '',
        newVal: '',
        idx: -1
      }
      this.loadData({ reload: true })
    }
  },
  async mounted () {
    await this.initData()
  },
  watch: {
    mainKey: {
      handler (newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  .main_box {
    padding: 10px;
    height: calc(100% - 124px);

    .title {
      font-size: 14px;
      line-height: 14px;
      display: flex;
      justify-content: space-between;

      .title_add_btn {
        color: $text-color-dark;
        cursor: pointer;

        .fa {
          margin-right: 5px;
        }

        &:hover {
          color: $text-color-light;
        }
      }
    }

    .data_box {
      height: calc(100% - 24px);
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .list_box {
        width: calc(100% / 2 - 10px / 2);
        flex-grow: 1;
        flex-shrink: 0;
        margin-right: 10px;

        .search_box {
          width: 100%;
          display: flex;
          flex-direction: row;

          .add_btn {
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            flex-grow: 0;
            flex-shrink: 0;
            padding: 0 10px;
            background-color: $background-color-dark;
            cursor: pointer;
          }

          .com-input {
            flex-grow: 1;
            background-color: $background-color-lighter;
            width: 100%;
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            display: block;
            padding: 0 10px;
          }
        }

        .val_list {
          border: 1px solid $border-color;
          margin-top: 10px;
          height: calc(100% - 10px - #{$grid-height-normal});
          overflow: hidden;
          overflow-y: auto;

          .val_item {
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            padding-left: 10px;
            box-sizing: border-box;
            border-bottom: 1px solid $border-color;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:last-child {
              /*border-bottom: none;*/
            }

            &:hover {
              background: $background-color-highlight-blue;
            }
          }
        }
      }

      .val_detail_box {
        width: calc(100% / 2 - 10px / 2);

        .val_box {
          display: flex;
          width: 100%;
          height: 100%;

          textarea.com-input {
            flex-grow: 1;
            padding: 10px;
          }

          .opt_group {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            width: 100px;

            & > div {
              width: 100px;
              flex-grow: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
</style>
