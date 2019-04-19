<template>
  <div class="create_config_mask" @click="$emit('close')">
    <div class="main_card" @click.stop="e=>e.preventDefault()">
      <div class="header">添加Redis配置</div>
      <div class="main_form">
        <!--Key-->
        <div class="form_item">
          <div class="item_label">Key</div>
          <div class="item_body">
            <input v-model="key" type="text" class="com-input">
          </div>
        </div>
        <!--类型-->
        <div class="form_item">
          <div class="item_label">Type</div>
          <div class="item_body">
            <SelectList
              v-model="type"
              placeholder="选择类型"
              :options="supportedTypes"
            ></SelectList>
          </div>
        </div>
        <!--按照不同类型显示不同的添加表单-->
        <template v-if="type==='string'">
          <div class="form_item">
            <div class="item_label">Value</div>
            <div class="item_body">
              <input v-model="stringValue" type="text" class="com-input">
            </div>
          </div>
        </template>
      </div>
      <div class="footer">
        <div class="com-btn com-btn-success btn_save" @click="saveData">
          <i class="fa fa-save"></i>
          <span> 保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectList from '../../../../../components/Form/SelectList'

export default {
  name: 'CreateMainKey',
  props: {
    tab: {
      type: Object,
      default: null
    }
  },
  components: { SelectList },
  data () {
    return {
      key: '',
      type: '',
      stringValue: '', // string类型的value
      supportedTypes: {
        string: 'String',
        hash: 'HashMap',
        list: 'List',
        set: 'Set',
        zset: 'SortedSet'
      }
    }
  },
  methods: {
    async saveData () {
      if (!this.key.length) {
        this.$msg.msgBox({ type: 'warning', msg: '请输入Key' })
        return false
      }
      if (!this.type.length) {
        this.$msg.msgBox({ type: 'warning', msg: '请选择类型' })
        return false
      }
      let conn = this.tab.connect
      switch (this.type) {
        case 'string':
          if (!this.stringValue.length) {
            this.$msg.msgBox({ type: 'warning', msg: '请输入Value' })
            return false
          }
          await conn.set(this.key, this.stringValue)
          break
        case 'hash':
          break
        case 'list':
          break
        case 'set':
          break
        case 'zset':
          break
        default:
          this.$msg.msgBox({ type: 'warning', msg: '类型错误' })
          return false
      }
      this.$msg.msgBox({ type: 'success', msg: '保存成功' })
      this.$emit('save') // 抛出保存数据的事件
      return true
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
  .create_config_mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: $background-color-mask;
    display: flex;
    flex-direction: column;
    align-items: center;

    .main_card {
      margin-top: 10px;
      box-shadow: $shadow-normal;
      background: $background-color;
      width: 30%;

      .header {
        border-bottom: 2px solid $border-color;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        padding-left: 10px;
      }

      .main_form {
        /*padding: 10px;*/

        .form_item {
          box-sizing: border-box;
          height: $grid-height-normal;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 1px solid $border-color;

          &:last-child {
            border-bottom: none;
          }

          .item_label {
            line-height: $grid-height-normal;
            width: 100px;
            text-align: right;
          }

          .item_body {
            padding: 0 10px;
            flex-grow: 1;

            .com-input {
              height: $grid-height-small;
              width: 100%;
              padding: 0 10px;
            }

            .com-select {
              height: $grid-height-small;
            }
          }
        }
      }

      .footer {
        border-top: 2px solid $border-color;
        display: flex;
        height: $grid-height-normal;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .com-btn {
          height: $grid-height-small;
          line-height: $grid-height-small;
          padding: 0 10px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
