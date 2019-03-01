<template>
  <div class="toolbar">
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-plus"></span>
      </div>
      <div class="tool_name">新建</div>
    </div>
    <div class="tool_item">
      <div class="tool_icon">
        <span class="fa fa-close"></span>
      </div>
      <div class="tool_name">关闭当前</div>
    </div>
  </div>
</template>

<script>
import electron from 'electron'

export default {
  name: 'Toolbar',
  data () {
    return {}
  },
  methods: {
    onClickNew () {
      let app = electron.app || electron.remote.app
      app.emit('createWindow', { path: 'test', width: 100, height: 100 })
    }
  }
}
</script>

<style scoped lang="scss">
  .toolbar {
    border-bottom: 1px solid #e8eaec;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px;

    .tool_item {
      cursor: pointer;
      width: 60px;
      height: 50px;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0);

      .tool_icon {
        text-align: center;
        font-size: 20px;
      }

      .tool_name {
        text-align: center;
      }

      &:hover {
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdee2;
      }
    }
  }
</style>
