<template>
  <div
    class="action_list_mask"
    @click="onHide"
  >
    <div
      class="action_list"
      @click.stop=""
    >
      <!-- 过滤器 -->
      <div class="filter_box">
        <input
          type="text"
          class="com-input"
          v-model="filterText"
          @keydown.esc="onHide"
          autofocus="autofocus"
        >
      </div>
      <!-- 提示文字 -->
      <div
        class="tip_text noselect"
        v-if="tipText.length"
      >
        {{tipText}}
      </div>
      <!-- 选项列表 -->
      <div class="actions noselect">
        <template v-for="(action,idx) in actionList">
          <div
            class="action"
            :key="idx"
            @click="onSelectAction(action,idx)"
            v-if="!filterText.length || action.toLowerCase().includes(filterText.toLowerCase())"
          >
            {{action}}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionList',
  props: {
    //   选项列表
    actionList: {
      type: Array,
      default: () => { return [] }
    },
    // 提示文字
    tipText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 过滤文字
      filterText: '',
      // Promsie控制函数
      funcResolve: null,
      funcReject: null
    }
  },
  methods: {
    onHide (e) {
      this.funcReject()
      this.doHide()
    },
    onSelectAction (action, idx) {
      this.funcResolve({ action: action, idx: idx })
      this.doHide()
    },
    doHide () {
      this.$emit('close')
      //   this.isShow = false
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.action_list_mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $background-color-mask;
  z-index: 99;
  .action_list {
    margin-top: 10px;
    background-color: $background-color;
    width: 30vw;
    .filter_box {
      .com-input {
        width: 100%;
        height: $grid-height-normal;
        padding: 0 10px;
      }
    }
    .tip_text {
      font-size: 12px;
      background-color: $background-color-dark;
      padding: 5px 0 5px 10px;
    }
    .actions {
      //   margin-top: 10px;
      max-height: 40vh;
      overflow: hidden;
      overflow-y: auto;

      .action {
        padding: 0 0 0 10px;
        cursor: pointer;
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        border-bottom: 1px solid $border-color;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: $background-color-lighter;
        }
      }
    }
  }
}
</style>
