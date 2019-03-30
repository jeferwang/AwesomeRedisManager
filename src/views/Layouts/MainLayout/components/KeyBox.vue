<template>
  <div class="key_box_main">
    <div class="key_label">
      键名
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
          重命名
        </div>
        <div
          class="com-btn com-btn-danger"
          @click="onClickDelete"
        >
          删除
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      key: null
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
    initData () {
      this.originKey = this.mainKey
      this.key = this.mainKey
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

  .key_label {
    line-height: 14px;
    height: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .btn_rename {
      cursor: pointer;

      &:hover {
        color: $text-color-light;
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
