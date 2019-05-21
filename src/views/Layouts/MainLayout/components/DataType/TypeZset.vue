<template>
  <div class="main_box">
    <div class="title">Zset Data</div>
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
          @scroll="onScrollList"
        >
          <div
            class="val_item"
            v-for="(obj,idx) in dataList"
            :key="idx"
            @click="onShowDetail(obj.val,obj.score,idx)"
            @contextmenu="e=>onShowContextMenu(e,obj.val,obj.score,idx)"
          >
            {{obj.val}}
          </div>
        </div>
      </div>
      <div
        class="detail_box"
        v-if="detail.oldScore.length"
      >
        <div class="score_box">
          <div class="score_tip_text">Score</div>
          <input
            type="text"
            class="score_input com-input"
            v-model="detail.newScore"
          >
        </div>
        <div class="hval_box">
          <textarea
            class="com-input"
            v-model="detail.newVal"
          ></textarea>
          <div class="opt_group">
            <div
              class="com-btn com-btn-warning"
              @click="onFormat"
            >
              Format
            </div>
            <div
              class="com-btn com-btn-success"
              @click="onSave"
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateMainKey
      v-if="showAddDialog"
      :tab="tab"
      :lock-key="mainKey"
      lock-type="zset"
      @close="showAddDialog=false"
      @save="onAddDataComplete"
    ></CreateMainKey>
    <CommonExtMenu
      v-if="extMenu.show"
      :style="{left:`${extMenu.x}px`,top:`${extMenu.y}px`}"
      :menu-list="extMenu.menuList"
      @select="onSelectExtMenu"
    ></CommonExtMenu>
  </div>
</template>

<script>
import CreateMainKey from '../Dialog/CreateMainKey'
import CommonExtMenu from '../CommonExtMenu'

export default {
  name: 'TypeZset',
  components: {
    CreateMainKey,
    CommonExtMenu
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
        oldScore: '',
        newScore: '',
        oldVal: '',
        newVal: '',
        idx: -1
      },
      extMenu: {
        menuList: [
          {
            key: 'delete',
            icon: 'fa-close',
            value: 'Delete'
          }
        ],
        show: false,
        x: 0,
        y: 0,
        tmpVal: '',
        tmpIdx: -1,
        tmpScore: ''
      }
    }
  },
  methods: {
    async onSelectExtMenu (e) {
      switch (e) {
        case 'delete':
          await this.tab.connect.zrem(this.mainKey, this.extMenu.tmpVal)
          this.dataList.splice(this.extMenu.tmpIdx, 1)
          if (this.extMenu.tmpScore === this.detail.oldScore) {
            this.detail.oldScore = ''
          }
          break
        default:
          break
      }
    },
    onShowContextMenu (e, val, score, idx) {
      e.preventDefault()
      this.extMenu.tmpVal = val
      this.extMenu.tmpScore = score
      this.extMenu.tmpIdx = idx
      this.extMenu.x = e.x + 5
      this.extMenu.y = e.y + 5
      this.extMenu.show = true
    },
    onAddDataComplete () {
      this.showAddDialog = false
      this.initData()
    },
    async onSave () {
      if (this.detail.oldVal === this.detail.newVal && this.detail.oldScore === this.detail.newScore) {
        return false
      }
      this.detail.newScore = `${this.detail.newScore}`
      try {
        // 先删除旧值
        await this.tab.connect.zrem(this.mainKey, this.detail.oldVal)
        // 然后添加新值
        await this.tab.connect.zadd(this.mainKey, this.detail.newScore, this.detail.newVal)
        this.detail.oldVal = this.detail.newVal
        this.detail.oldScore = this.detail.newScore
        this.$set(this.dataList, this.detail.idx, { val: this.detail.newVal, score: this.detail.newScore })
        this.$msg.msgBox({ msg: 'Save Successfully', type: 'success', duration: 1000 })
      } catch (e) {
        this.$msg.msgBox({ msg: 'Save Failed', type: 'warning', duration: 1000 })
        console.warn(e)
        return false
      }
    },
    onFormat () {
      if (!this.detail.newVal) {
        return false
      }
      let val = null
      this.$popup.actionList({ actionList: ['XML', 'JSON'], tipText: 'Please choose the format' })
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
            this.$msg.msgBox({ msg: 'Format failure', type: 'warning' })
            return false
          }
          this.$msg.msgBox({ msg: 'Format complete', type: 'success', duration: 1000 })
          this.detail.newVal = val
        })
    },
    async onShowDetail (val, score, idx) {
      this.detail.oldScore = score
      this.detail.newScore = score
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
    async onScrollList (e) {
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
      console.log('cursor', cursor)
      while (true) {
        res = await this.tab.connect.zscan(this.mainKey, cursor, ...extParams)
        cursor = parseInt(res[0])
        if (res[1] && res[1].length) {
          for (let i = 0; i < res[1].length; i += 2) {
            this.dataList.push({
              val: res[1][i],
              score: res[1][i + 1]
            })
          }
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
        oldScore: '',
        newScore: '',
        oldVal: '',
        newVal: '',
        idx: -1
      }
      this.loadData({ reload: true })
    },
    hideExtMenuListener (e) {
      if (this.extMenu.show) {
        this.extMenu.show = false
      }
    }
  },
  async mounted () {
    window.addEventListener('click', this.hideExtMenuListener)
    await this.initData()
  },
  beforeDestroy () {
    window.removeEventListener('click', this.hideExtMenuListener)
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
    }

    .data_box {
      height: calc(100% - 24px);
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .list_box {
        flex-grow: 1;
        flex-shrink: 0;
        margin-right: 10px;
        width: calc(100% / 2 - 10px / 2);

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
          // background-color: $background-color-lighter;
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: $background-color-highlight-blue;
            }
          }
        }
      }

      .detail_box {
        width: calc(100% / 2 - 10px / 2);

        .score_box {
          display: flex;
          flex-direction: row;

          .score_tip_text {
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            text-align: center;
            padding: 0 10px;
            background: $background-color-dark;
          }

          .score_input {
            flex-grow: 1;
            flex-shrink: 0;
            display: block;
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            padding: 0 10px;
          }

          .btn_rename_hkey {
            flex-grow: 0;
            flex-shrink: 0;
            height: $grid-height-normal;
            line-height: $grid-height-normal;
            width: 100px;
            text-align: center;
          }
        }

        .hval_box {
          display: flex;
          margin-top: 10px;
          height: calc(100% - 10px - #{$grid-height-normal});

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
