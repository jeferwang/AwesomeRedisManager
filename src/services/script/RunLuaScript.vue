<template>
  <FullScreenMask class="mask" @click="$emit('close')">
    <SimplePanel class="main_panel" @click.stop>
      <div class="title">
        <div>Please Input Lua Script</div>
        <div class="run_btn" @click="onRunLua">
          <span class="fa fa-play"></span>
          <span>Run</span>
        </div>
      </div>
      <CodeMirror v-model="content"></CodeMirror>
    </SimplePanel>
  </FullScreenMask>
</template>

<script>
import { mapGetters } from 'vuex'
import FullScreenMask from '../../components/FullScreenMask'
import SimplePanel from '../../components/SimplePanel'
import CodeMirror from '../../components/Form/CodeMirror'

export default {
  name: 'RunLuaScript',
  components: {
    FullScreenMask,
    SimplePanel,
    CodeMirror
  },
  props: {
    resolve: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async onRunLua () {
      if (!this.content) {
        return this.$msg.msgBox({ msg: 'Please input Lua code', type: 'warning' })
      }
      // 找到当前活动的tab标签
      let activeTab = this.activeTab
      if (!activeTab) {
        return this.$msg.msgBox({ type: 'success', msg: 'No matched active tab' })
      }
      // 计算函数名
      let funcName = `f_${this.$hash.sha1(this.content)}`
      // 加载lua脚本，得到sha1
      let connect = activeTab.connect
      try {
        console.log(123)
        await connect.defineCommand(funcName, {
          numberOfKeys: 0,
          lua: this.content
        })
      } catch (e) {
        return this.$msg.msgBox({ type: 'warning', msg: e.message })
      }
      // 执行sha1，得到结果
      try {
        const evalRes = await connect[funcName]()
        console.log('evalRes', evalRes)
        this.resolve && this.resolve({
          code: this.content,
          result: evalRes
        })
        this.$emit('close')
        return this.$msg.msgBox({ type: 'success', msg: 'Eval lua script successfully, please refresh data' })
      } catch (e) {
        return this.$msg.msgBox({ type: 'warning', msg: e.message })
      }
    }
  },
  computed: {
    ...mapGetters('tabs', ['activeTab'])
  }
}
</script>

<style scoped lang="scss">
  .mask {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .main_panel {
      margin-top: 10px;
      height: fit-content;

      .title {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .run_btn {
          border: 1px solid $border-color;
          padding: 2px 10px;
          border-radius: 2px;
          cursor: pointer;

          .fa {
            margin-right: 5px;
            color: $common-color-success;
          }

          &:hover {
            .fa {
              color: $common-color-success-light;
            }
          }
        }
      }

      .script_input {
        width: 100%;
        padding: 10px;
        height: 400px;
      }
    }
  }
</style>
