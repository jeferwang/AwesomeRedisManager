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
        <div class="child_form no-scroll-bar">
          <!--string-->
          <template v-if="type==='string'">
            <div class="form_item">
              <div class="item_label">Value</div>
              <div class="item_body">
                <input v-model="stringValue" type="text" class="com-input">
              </div>
            </div>
          </template>
          <!--/string-->
          <!--hash-->
          <template v-if="type==='hash'">
            <div
              class="hash_group"
              v-for="(hashItem,hashIdx) in hashData"
              :key="hashIdx"
            >
              <div class="form_item">
                <div class="item_label">Hash Key</div>
                <div class="item_body">
                  <input v-model="hashData[hashIdx].key" type="text" class="com-input">
                  <div
                    class="del_hash_key_btn com-btn com-btn-danger"
                    @click="hashData.splice(hashIdx,1)"
                  >
                    <span class="fa fa-close"></span>
                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="item_label">Hash Value</div>
                <div class="item_body">
                  <input v-model="hashData[hashIdx].value" type="text" class="com-input">
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="hashData.push({key:'',value:''})"
              >
                <span class="fa fa-plus"></span>
                <span> 添加 Hash Item</span>
              </div>
            </div>
          </template>
          <!--/hash-->
          <!--list-->
          <template v-if="type==='list'">
            <div
              class="form_item"
              v-for="(listItem,listIdx) in listData"
              :key="listIdx"
            >
              <div class="item_label">List Item</div>
              <div class="item_body">
                <input v-model="listData[listIdx]" type="text" class="com-input">
                <div
                  class="del_hash_key_btn com-btn com-btn-danger"
                  @click="listData.splice(listIdx,1)"
                >
                  <span class="fa fa-close"></span>
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="listData.push('')"
              >
                <span class="fa fa-plus"></span>
                <span> 添加 List Item</span>
              </div>
            </div>
          </template>
          <!--/list-->
          <!--set-->
          <template v-if="type==='set'">
            <div
              class="form_item"
              v-for="(setItem,setIdx) in setData"
              :key="setIdx"
            >
              <div class="item_label">Set Item</div>
              <div class="item_body">
                <input v-model="setData[setIdx]" type="text" class="com-input">
                <div
                  class="del_hash_key_btn com-btn com-btn-danger"
                  @click="setData.splice(setIdx,1)"
                >
                  <span class="fa fa-close"></span>
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="setData.push('')"
              >
                <span class="fa fa-plus"></span>
                <span> 添加 Set Item</span>
              </div>
            </div>
          </template>
          <!--/set-->
          <!--zset-->
          <template v-if="type==='zset'">
            <div
              class="zset_group"
              v-for="(zsetItem,zsetIdx) in zsetData"
              :key="zsetIdx"
            >
              <div class="form_item">
                <div class="item_label">Zset Score</div>
                <div class="item_body">
                  <input v-model="zsetData[zsetIdx].score" type="text" class="com-input">
                  <div
                    class="del_zset_key_btn com-btn com-btn-danger"
                    @click="zsetData.splice(zsetIdx,1)"
                  >
                    <span class="fa fa-close"></span>
                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="item_label">Zset Value</div>
                <div class="item_body">
                  <input v-model="zsetData[zsetIdx].value" type="text" class="com-input">
                </div>
              </div>
            </div>
            <div class="add_btn_wrapper">
              <div
                class="com-btn com-btn-primary add_btn"
                @click="zsetData.push({score:'',value:''})"
              >
                <span class="fa fa-plus"></span>
                <span> 添加 Zset Item</span>
              </div>
            </div>
          </template>
          <!--/zset-->
        </div>
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
      hashData: [],
      listData: [],
      setData: [],
      zsetData: [],
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
      try {
        if (!this.key.length) throw new Error('请输入Key')
        if (!this.type.length) throw new Error('请选择类型')
        switch (this.type) {
          case 'string':
            await this.saveStringData()
            break
          case 'hash':
            await this.saveHashData()
            break
          case 'list':
            await this.saveListData()
            break
          case 'set':
            await this.saveSetData()
            break
          case 'zset':
            await this.saveZsetData()
            break
          default:
            return false
        }
        this.$msg.msgBox({ type: 'success', msg: '保存成功' })
        this.$emit('save') // 抛出保存数据的事件
      } catch (e) {
        this.$msg.msgBox({ type: 'warning', msg: e.message })
      }
    },
    async saveZsetData () {
      let conn = this.tab.connect
      if (!this.zsetData.length) {
        throw new Error('请添加Zset具体数据')
      }
      let args = []
      // 验证zsetData的有效性
      for (let i = 0; i < this.zsetData.length; i++) {
        if (!this.zsetData[i].score.length || !this.zsetData[i].value.length) {
          throw new Error('请完整填写Zset数据')
        }
        args.push(this.zsetData[i].score, this.zsetData[i].value)
      }
      await conn.hmset(this.key, ...args)
    },
    async saveSetData () {
      let conn = this.tab.connect
      if (!this.setData.length) {
        throw new Error('请添加Set具体数据')
      }
      let args = []
      // 验证hashData的有效性
      for (let i = 0; i < this.setData.length; i++) {
        if (!this.setData[i].length) {
          throw new Error('请完整填写Set数据')
        }
        args.push(this.setData[i])
      }
      await conn.sadd(this.key, ...args)
    },
    async saveListData () {
      let conn = this.tab.connect
      if (!this.listData.length) {
        throw new Error('请添加List具体数据')
      }
      let args = []
      // 验证hashData的有效性
      for (let i = 0; i < this.listData.length; i++) {
        if (!this.listData[i].length) {
          throw new Error('请完整填写List数据')
        }
        args.push(this.listData[i])
      }
      await conn.rpush(this.key, ...args)
    },
    async saveHashData () {
      let conn = this.tab.connect
      if (!this.hashData.length) {
        throw new Error('请添加HashMap具体数据')
      }
      let args = []
      // 验证hashData的有效性
      for (let i = 0; i < this.hashData.length; i++) {
        if (!this.hashData[i].key.length || !this.hashData[i].value.length) {
          throw new Error('请完整填写HashMap数据')
        }
        args.push(this.hashData[i].key, this.hashData[i].value)
      }
      await conn.hmset(this.key, ...args)
    },
    async saveStringData () {
      let conn = this.tab.connect
      if (!this.stringValue.length) {
        throw new Error('请输入Value')
      }
      await conn.set(this.key, this.stringValue)
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

          .item_label {
            line-height: $grid-height-normal;
            width: 100px;
            text-align: right;
          }

          .item_body {
            padding: 0 10px;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: center;

            .com-input {
              display: block;
              height: $grid-height-small;
              width: 100%;
              padding: 0 10px;
            }

            .com-select {
              height: $grid-height-small;
            }

            .del_hash_key_btn {
              width: $grid-height-small;
              height: $grid-height-small;
              line-height: $grid-height-small;
              text-align: center;
              flex-shrink: 0;
            }
          }
        }

        .child_form {
          background-color: $background-color-dark;
          max-height: 300px;
          overflow: hidden;
          overflow-y: auto;

          .add_btn_wrapper {
            height: $grid-height-normal;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0 10px;

            .add_btn {
              display: block;
              width: fit-content;
              height: $grid-height-small;
              line-height: $grid-height-small;
              padding: 0 10px;
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
