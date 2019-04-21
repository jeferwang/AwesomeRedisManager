<template>
  <div class="toolbar no-select">
    <!--left-->
    <div class="left">
      <div class="tool_item" @click="onClickNew">
        <div class="tool_icon">
          <span class="fa fa-plus"></span>
        </div>
        <div class="tool_name">New</div>
      </div>
      <div class="tool_item" @click="onClickNew">
        <div class="tool_icon">
          <span class="fa fa-download"></span>
        </div>
        <div class="tool_name">Import</div>
      </div>
      <div class="tool_item" @click="onClickNew">
        <div class="tool_icon">
          <span class="fa fa-upload"></span>
        </div>
        <div class="tool_name">Export</div>
      </div>
    </div>
    <!--/left-->
    <!--right-->
    <div class="right">
      <div class="tool_item" @click="onClickRefresh">
        <div class="tool_icon">
          <span class="fa fa-refresh"></span>
        </div>
        <div class="tool_name">Refresh</div>
      </div>
      <div class="tool_item" @click="onClickNew">
        <div class="tool_icon">
          <span class="fa fa-file-text-o"></span>
        </div>
        <div class="tool_name">Script</div>
      </div>
    </div>
    <!--/right-->
    <!--
    <div class="tool_item" @click="onClickNew">
      <div class="tool_icon">
        <span class="fa fa-cloud"></span>
      </div>
      <div class="tool_name">云备份</div>
    </div>
    -->
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
  data () {
    return {}
  },
  methods: {
    onClickRefresh () {
      this.$eventBus.$emit('reload-current-tab')
    },
    onClickNew () {
      this.$emit('show-create-config')
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
    justify-content: space-between;

    .left, .right {
      display: flex;
      flex-direction: row;
      align-items: center;

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
  }
</style>
