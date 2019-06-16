<template>
  <div class="key_box_main">
    <div class="key_line">
      <div class="key_label">
        Key Name
      </div>
      <div class="ttl_box">
        <div v-show="!editTTL" class="show_ttl">
          <div>TTL:</div>
          <div>{{TTL}}&nbsp;({{expireDate}})</div>
          <div class="btn_modify_TTL" @click="onEditTTL"><i class="fa fa-pencil-square-o"></i></div>
        </div>
        <div v-show="editTTL" class="edit_ttl">
          <div>Modify TTL:&nbsp;</div>
          <input
            ref="ttlEditBox"
            type="text"
            class="com-input ttl_input"
            v-model="tmpTTL"
            @blur="onSaveTTL"
          >
        </div>
      </div>
    </div>
    <div class="input_box">
      <textarea
        class="com-input key_input"
        v-model="key"
        :placeholder="originKey"
      ></textarea>
      <div class="opt_group">
        <div
          class="com-btn com-btn-primary"
          @click="onClickRename"
        >
          Rename
        </div>
        <div
          class="com-btn com-btn-danger"
          @click="onClickDelete"
        >
          Delete
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'KeyBox',
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
      originKey: null,
      key: null,
      TTL: 0,
      tmpTTL: 0,
      editTTL: true
    }
  },
  computed: {
    expireDate () {
      if (this.TTL === -1) {
        return 'Infinite'
      }
      return `Expires on ${moment(Date.now() + this.TTL * 1000).format('YYYY-MM-DD hh:mm:ss')}`
    }
  },
  methods: {
    async onEditTTL () {
      await this.refreshTTL()
      this.editTTL = true
      this.$refs.ttlEditBox.focus()
    },
    async onSaveTTL () {
      console.log(this.TTL, this.tmpTTL)
      if (this.TTL.toString() !== this.tmpTTL.toString()) {
        // 检查值的有效性
        if (!/^-?\d+$/.test(this.tmpTTL)) {
          return this.$msg.msgBox({ msg: 'TTL must be integer', type: 'warning' })
        }
        if (parseInt(this.tmpTTL) < -1) {
          return this.$msg.msgBox({ msg: 'TTL must be greater than -1', type: 'warning' })
        }
        if (this.tmpTTL.toString() !== '-1') {
          if (this.tmpTTL.toString() === '0') {
            // todo 删除提示
            this.$emit('delete-key')
          } else {
            await this.tab.connect.expire(this.mainKey, this.tmpTTL)
          }
        } else {
          await this.tab.connect.persist(this.mainKey)
        }
      }
      this.refreshTTL()
      this.editTTL = false
    },
    onClickRename () {
      if (this.key === this.originKey) {
        return false
      }
      this.$emit('rename-key', { oldKey: this.originKey, newKey: this.key })
    },
    // 删除这个Key，并关闭预览
    // todo 删除提示
    onClickDelete () {
      this.$emit('delete-key')
    },
    async refreshTTL () {
      // 获取TTL
      const TTL = await this.tab.connect.ttl(this.mainKey)
      if (TTL) {
        this.TTL = TTL
        this.tmpTTL = TTL
      }
    },
    async initData () {
      this.originKey = this.mainKey
      this.key = this.mainKey
      this.editTTL = false
      this.refreshTTL()
    }
  },
  mounted () {
    this.initData()
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
  .key_box_main {
    padding: 10px;
    font-size: 14px;

    .key_line {
      display: flex;
      height: 20px;
      flex-direction: row;
      align-items: center;

      .key_label {
        line-height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-right: 15px;

        .btn_rename {
          cursor: pointer;

          &:hover {
            color: $text-color-light;
          }
        }
      }

      .ttl_box {
        .show_ttl {
          display: flex;
          flex-direction: row;
          align-items: center;

          .btn_modify_TTL {
            margin-left: 5px;
            height: 20px;
            width: 20px;
            text-align: center;
            line-height: 20px;
            cursor: pointer;
            transition: color .5s;
            border-radius: 2px;

            &:hover {
              background-color: $background-color-dark;
              color: #ffffff;
            }
          }
        }

        .edit_ttl {
          display: flex;
          flex-direction: row;
          align-items: center;

          .ttl_input {
            height: 20px;
            padding: 0 5px;
          }
        }
      }
    }

    .input_box {
      display: flex;
      flex-direction: row;
      height: 80px;
      margin-top: 10px;

      .key_input {
        flex-grow: 1;
        height: 100%;
        display: block;
        width: 100%;
        padding: 10px;
        line-height: 18px;
      }

      .opt_group {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        & > div {
          width: 100px;
          height: $grid-height-normal;
          line-height: $grid-height-normal;
          text-align: center;
        }
      }
    }
  }
</style>
