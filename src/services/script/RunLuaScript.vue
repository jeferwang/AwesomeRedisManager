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
      // 找到当前活动的tab标签
      // 加载lua脚本，得到sha1（script load）
      // 执行sha1，得到结果（evalsha）
      this.resolve && this.resolve({
        code: this.content,
        result: null // todo 抛出lua执行结果
      })
    }
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
