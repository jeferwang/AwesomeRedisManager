<template>
  <div class="main_box">
    <div class="value_box">
      <div>值</div>
      <div class="input_box">
        <textarea
          v-model="val"
          class="com-input value_input"
        ></textarea>
        <div class="opt_group">
          <div
            class="com-btn com-btn-primary"
            @click="onFormat"
          >
            Format
          </div>
          <div
            class="com-btn com-btn-success"
            @click="onSave"
          >
            Save
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeString',
  props: {
    tab: {
      type: Object,
      default: null
    },
    mainKey: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      originVal: null,
      val: null
    }
  },
  methods: {
    onFormat () {
      if (!this.val || !this.val.length) {
        return false
      }
      let val = null
      this.$popup.actionList({ actionList: ['XML', 'JSON'], tipText: 'Please choose the format' })
        .then(res => {
          switch (res.action) {
            case 'XML':
              val = this.$formatXML(this.val)
              break
            case 'JSON':
              val = this.$formatJSON(this.val)
              break
          }
          if (!val || !val.length) {
            // 报错提示
            this.$msg.msgBox({ msg: 'Format failure', type: 'warning' })
            return false
          }
          this.$msg.msgBox({ msg: 'Format complete', type: 'success', duration: 1000 })
          this.val = val
        })
    },
    async onSave () {
      if (this.val === this.originVal) {
        return false
      }
      await this.tab.connect.set(this.mainKey, this.val)
      // 保存成功的提示
      this.$msg.msgBox({ msg: '保存成功', type: 'success', duration: 1500 })
    },
    async initData () {
      let val = await this.tab.connect.get(this.mainKey)
      this.originVal = val
      this.val = val
    }
  },
  async mounted () {
    await this.initData()
  },
  watch: {
    mainKey: {
      handler (newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.main_box {
  padding: 10px;

  .value_box {
    font-size: 14px;

    .input_box {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .value_input {
        flex-grow: 1;
        width: 100%;
        padding: 10px;
        line-height: 18px;
        display: block;
        height: 300px;
      }

      .opt_group {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        & > div {
          width: 100px;
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
