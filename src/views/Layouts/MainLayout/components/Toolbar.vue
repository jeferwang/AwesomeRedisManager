<template>
  <div class="toolbar noselect">
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-plus"></span>
      </div>
      <div class="tool_name">新建</div>
    </div>
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-download"></span>
      </div>
      <div class="tool_name">导入</div>
    </div>
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-upload"></span>
      </div>
      <div class="tool_name">导出</div>
    </div>
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-cloud"></span>
      </div>
      <div class="tool_name">云备份</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
  data () {
    return {}
  },
  methods: {
    onClickNew () {
      this.$windowsManager.openCreateConfig()
    }
  }
}
</script>

<style scoped lang="scss">
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid #464646;
    box-sizing: border-box;

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
      color: #cacaca;

      .tool_icon {
        text-align: center;
        font-size: 20px;
      }

      .tool_name {
        text-align: center;
      }

      &:hover {
        color: #eaeaea;
      }
    }
  }
</style>
