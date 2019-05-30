<template>
  <div class="key_box_main">
    <div class="key_line">
      <div class="key_label">
        Key Name
      </div>
      <div class="ttl_box">
        <div>TTL:</div>
        <div>{{ttl}}&nbsp;({{expireDate}})</div>
        <div class="btn_modify_ttl"><i class="fa fa-pencil-square-o"></i></div>
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
      ttl: 0
    }
  },
  computed: {
    expireDate () {
      if (this.ttl === -1) {
        return 'Expires after the end of the world'
      }
      return `Expires on ${moment(Date.now() + this.ttl * 1000).format('YYYY-MM-DD hh:mm:ss')}`
    }
  },
  methods: {
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
    async initData () {
      this.originKey = this.mainKey
      this.key = this.mainKey
      // 获取ttl
      const ttl = await this.tab.connect.ttl(this.mainKey)
      if (ttl) {
        this.ttl = ttl
      }
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
        display: flex;
        flex-direction: row;
        align-items: center;

        .btn_modify_ttl {
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
