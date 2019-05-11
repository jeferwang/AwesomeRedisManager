<template>
  <div class="toolbar no-select">
    <!--left-->
    <div class="left">
      <div
        class="tool_item"
        @click="onClick('new')"
      >
        <div class="tool_icon">
          <span class="fa fa-plus"></span>
        </div>
        <div class="tool_name">New</div>
      </div>
      <div
        class="tool_item"
        @click="onClick('import')"
      >
        <div class="tool_icon">
          <span class="fa fa-download"></span>
        </div>
        <div class="tool_name">Import</div>
      </div>
      <div
        class="tool_item"
        @click="onClick('export')"
      >
        <div class="tool_icon">
          <span class="fa fa-upload"></span>
        </div>
        <div class="tool_name">Export</div>
      </div>
    </div>
    <!--/left-->
    <!--right-->
    <div class="right">
      <div
        class="tool_item"
        @click="onClick('refresh')"
      >
        <div class="tool_icon">
          <span class="fa fa-refresh"></span>
        </div>
        <div class="tool_name">Refresh</div>
      </div>
      <div
        class="tool_item"
        @click="onClick('script')"
      >
        <div class="tool_icon">
          <span class="fa fa-file-text-o"></span>
        </div>
        <div class="tool_name">Script</div>
      </div>
    </div>
    <!--/right-->
    <!--
    <div class="tool_item" @click="onClick('new')">
      <div class="tool_icon">
        <span class="fa fa-cloud"></span>
      </div>
      <div class="tool_name">云备份</div>
    </div>
    -->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import * as fs from 'fs'

export default {
  name: 'Toolbar',
  data () {
    return {}
  },
  methods: {
    onClick (cmd) {
      switch (cmd) {
        case 'new':
          this.$emit('show-create-config')
          break
        case 'import':
          this.$msg.msgBox({ msg: '功能尚未完成，敬请期待', type: 'success' })
          break
        case 'export':
          ipcRenderer.send('export-configs')
          break
        case 'refresh':
          this.$eventBus.$emit('reload-current-tab')
          break
        case 'script':
          this.$services.script.runLuaScript()
          break
      }
    },
    regEventListeners () {
      ipcRenderer.on('export-configs', (e, fileName) => {
        // console.log(fileName)
        // 获取所有连接配置信息
        const jsonData = JSON.stringify(this.getConfigs, null, '  ')
        // 写入文件
        try {
          fs.writeFileSync(fileName, jsonData)
          this.$msg.msgBox({ msg: 'Export Success', type: 'success' })
        } catch (e) {
          this.$msg.msgBox({ msg: 'Export Fail,Please check permission', type: 'warning' })
        }
      })
    }
  },
  computed: {
    ...mapGetters('redisConfig', [
      'getConfigs'
    ])
  },
  mounted () {
    this.regEventListeners()
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

    .left,
    .right {
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
