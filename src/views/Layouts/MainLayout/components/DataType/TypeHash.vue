<template>
  <div class="main_box">
    <div class="title">数据</div>
    <div class="data_box">
      <div class="hkeys_box">
        <div class="hsearch_box">
          <div class="tip_text">筛选 Hash Key</div>
          <input
            type="text"
            class="com-input"
            v-model="hMatch"
            @input="onInputKeyCondition"
            @keydown.esc="onClearHkeyCondition"
          >
        </div>
        <div
          class="hkey_list noselect"
          @scroll="onScrollHkeyList"
        >
          <div
            class="hkey_item"
            v-for="(hkey,hkIdx) in hkeyList"
            :key="hkIdx"
            @click="onShowHkeyDetail(hkey,hkIdx)"
          >
            {{hkey}}
          </div>
        </div>
      </div>
      <div
        class="hdetail_box"
        v-if="detail.oldKey.length"
      >
        <div class="hkey_box">
          <input
            type="text"
            class="hkey_input com-input"
            v-model="detail.newKey"
          >
          <div
            class="btn_rename_hkey com-btn com-btn-primary"
            @click="onRenameHKey"
          >
            重命名
          </div>
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
  </div>
</template>

<script>
export default {
  name: 'TypeHash',
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
      loading: false,
      hasMore: true,
      hkeyList: [],
      hCursor: 0,
      hMatch: '',
      detail: {
        oldKey: '',
        newKey: '',
        oldVal: '',
        newVal: ''
      }
    }
  },
  methods: {
    async onSave () {
      if (this.detail.oldVal === this.detail.newVal) {
        return false
      }
      if (this.detail.oldKey !== this.detail.newKey) {
        // 丢弃key的修改
        this.detail.newKey = this.detail.oldKey
      }
      try {
        await this.tab.connect.hset(this.mainKey, this.detail.newKey, this.detail.newVal)
        this.detail.oldVal = this.detail.newVal
        this.$msg.msgBox({ msg: '保存成功', type: 'success', duration: 1000 })
      } catch (e) {
        this.$msg.msgBox({ msg: '保存失败', type: 'warning', duration: 1000 })
        console.warn(e)
        return false
      }
    },
    onFormat () {
      if (!this.detail.newVal) {
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
    async onRenameHKey () {
      if (this.detail.oldKey === this.detail.newKey) {
        return false
      }
      // 丢弃对val的修改
      this.detail.newVal = this.detail.oldVal
      // 创建新的key，赋值oldVal
      try {
        await this.tab.connect.hset(this.mainKey, this.detail.newKey, this.detail.oldVal)
        await this.tab.connect.hdel(this.mainKey, this.detail.oldKey)
        // 查找列表是否存在此key并进行修改
        for (let i = 0; i < this.hkeyList.length; i++) {
          if (this.hkeyList[i] === this.detail.oldKey) {
            this.$set(this.hkeyList, i, this.detail.newKey)
            break
          }
        }
        this.detail.oldKey = this.detail.newKey
        this.$msg.msgBox({ msg: '重命名成功', type: 'success' })
      } catch (e) {
        console.warn(e)
        return false
      }
    },
    async onShowHkeyDetail (hkey) {
      // 检查是否存在
      let hVal
      try {
        hVal = await this.tab.connect.hget(this.mainKey, hkey)
        if (hVal === null) {
          this.$msg.msgBox({ msg: `HashMap ${this.mainKey} 不存在 ${hkey}` })
          return false
        }
      } catch (e) {
        console.warn(e)
        return false
      }
      this.detail.oldKey = hkey
      this.detail.newKey = hkey
      this.detail.oldVal = hVal
      this.detail.newVal = hVal
    },
    async onClearHkeyCondition () {
      this.hMatch = ''
      this.loadHkeys({ reload: true })
    },
    async onInputKeyCondition () {
      this.loadHkeys({ reload: true })
    },
    async onScrollHkeyList (e) {
      let sHeight = e.target.scrollHeight
      let boxHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (sHeight - (boxHeight + scrollTop) < 20) {
        this.loadHkeys()
      }
    },
    async loadHkeys ({ reload = false } = {}) {
      if (this.loading) {
        return false
      }
      if (!this.hasMore && !reload) {
        return false
      }
      if (reload) {
        this.hkeyList = []
        this.hCursor = 0
        this.hasMore = true
      }
      this.loading = true
      let extParams = ['count', 100]
      if (this.hMatch.length) {
        extParams.push(...['match', `*${this.hMatch}*`])
      }
      let res
      let cursor = this.hCursor
      console.log('cursor', cursor)
      while (true) {
        res = await this.tab.connect.hscan(this.mainKey, cursor, ...extParams)
        cursor = parseInt(res[0])
        if (res[1] && res[1].length) {
          this.hkeyList.push(...res[1].filter((v, k) => k % 2 === 0))
        }
        if (parseInt(res[0]) === 0 || this.hkeyList.length > 100) {
          // 到结尾或者拿到了想要的数量
          break
        }
      }
      this.hCursor = cursor
      if (this.hCursor === 0) {
        this.hasMore = false
      }
      this.loading = false
    },
    async initData () {
      this.detail = {
        oldKey: '',
        newKey: '',
        oldVal: '',
        newVal: '',
        idx: -1
      }
      this.loadHkeys({ reload: true })
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
  padding-bottom: 10px;
  .title {
    font-size: 14px;
    line-height: 14px;
  }
  .data_box {
    height: calc(100% - 24px);
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    .hkeys_box {
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 10px;
      .hsearch_box {
        width: 100%;
        display: flex;
        flex-direction: row;
        .tip_text {
          height: $grid-height-normal;
          line-height: $grid-height-normal;
          flex-grow: 0;
          flex-shrink: 0;
          padding: 0 10px;
          background-color: $background-color-dark;
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
      .hkey_list {
        border: 1px solid $border-color;
        // background-color: $background-color-lighter;
        margin-top: 10px;
        height: calc(100% - 10px - #{$grid-height-normal});
        overflow: hidden;
        overflow-y: auto;
        .hkey_item {
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

    .hdetail_box {
      width: calc(100% / 2 - 10px / 2);
      .hkey_box {
        display: flex;
        flex-direction: row;
        .hkey_input {
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
