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
            <SelectList v-model="type" placeholder="选择类型" :options="supportedTypes"></SelectList>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="com-btn com-btn-success btn_save" @click="saveConfig">
          <i class="fa fa-plus"></i>
          <span> 创建</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectList from '../../../../../components/Form/SelectList'

export default {
  name: 'CreateMainKey',
  components: { SelectList },
  data () {
    return {
      key: '',
      type: '',
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
    getConfig () {
      return {
        name: this.formData.name || this.formData.host || '127.0.0.1',
        host: this.formData.host || '127.0.0.1',
        port: this.formData.port || 6379,
        password: this.formData.password || null,
        createdAt: this.formData.createdAt || Date.now(),
        isFavorite: this.formData.isFavorite || false
      }
    },
    async testConfig () {
      const config = this.getConfig()
      let client = await this.$connectRedis(config)
      try {
        await client.select(0)
        this.$msg.msgBox({ msg: '连接成功', type: 'success' })
      } catch (e) {
        this.$msg.msgBox({ msg: '连接失败', type: 'warning' })
      }
      client.disconnect(false)
    },
    saveConfig () {
      const config = this.getConfig()
      this.$store.dispatch('redisConfig/saveConfig', config)
        .then(() => {
          this.$storage.local.remove('tmpEditConfig')
          this.$msg.msgBox({ msg: '保存成功', type: 'success' })
          this.$emit('close')
        })
        .catch(err => {
          console.log(err)
          this.$msg.msgBox({ msg: '保存失败', type: 'warning' })
        })
    }
  },
  mounted () {
    const tmp = this.$storage.local.get('tmpEditConfig')
    if (tmp) {
      this.formData = tmp
    }
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
