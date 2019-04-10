<template>
  <div class="main">
    <KeyBox
      :tab="tab"
      :main-key="mainKey"
      @delete-key="onDelete"
      @rename-key="onRename"
    ></KeyBox>
    <TypeString
      v-if="keyType==='string'"
      :tab="tab"
      :main-key="mainKey"
    ></TypeString>
    <TypeHash
      v-if="keyType==='hash'"
      :tab="tab"
      :main-key="mainKey"
    ></TypeHash>
    <TypeList
      v-if="keyType==='list'"
      :tab="tab"
      :main-key="mainKey"
    ></TypeList>
    <TypeSet
      v-if="keyType==='set'"
      :tab="tab"
      :main-key="mainKey"
    ></TypeSet>
    <TypeZset
      v-if="keyType==='zset'"
      :tab="tab"
      :main-key="mainKey"
    ></TypeZset>
  </div>
</template>

<script>
import KeyBox from './KeyBox'
import TypeString from './DataType/TypeString'
import TypeHash from './DataType/TypeHash'
import TypeList from './DataType/TypeList'
import TypeSet from './DataType/TypeSet'
import TypeZset from './DataType/TypeZset'

const supportedTypes = ['string', 'hash', 'list', 'set', 'zset']

export default {
  name: 'DataView',
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
  components: {
    KeyBox,
    TypeString,
    TypeHash,
    TypeList,
    TypeSet,
    TypeZset
  },
  data () {
    return {
      keyType: '' // mainKey的数据类型
    }
  },
  methods: {
    async onDelete () {
      this.$emit('delete-key')
    },
    async onRename (e) {
      this.$emit('rename-key', e)
    },
    async initData () {
      let keyType = await this.tab.connect.type(this.mainKey)
      if (keyType === 'none') {
        this.$emit('error', { code: -1, message: `${this.mainKey}不存在` })
        return false
      }
      console.log(keyType)
      if (!supportedTypes.includes(keyType)) {
        this.$emit('error', { code: -2, message: `不支持的数据类型${keyType}` })
        return false
      }
      this.keyType = keyType
    }
  },
  watch: {
    mainKey: {
      handler (newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  },
  async mounted () {
    await this.initData()
  }
}
</script>

<style scoped lang="scss">
  .main {
    height: 100%;
  }
</style>
