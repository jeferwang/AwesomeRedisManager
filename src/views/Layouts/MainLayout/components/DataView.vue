<template>
  <div class="data_view_item">
    <div class="left">
      <div class="db_selector">
        <Select v-model="currDb" size="small">
          <Option v-for="dbi in dbNum" :value="dbi-1" :key="dbi-1">DB{{ dbi-1 }}</Option>
        </Select>
      </div>
      <div class="key_list">
        <div class="key_item"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataView',
  props: {
    tab: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dbNum: 0,
      currDb: 0
    }
  },
  methods: {},
  async created () {
    // 读取数据库的数量
    let dbNum = await this.tab.connect.config('get', 'databases')
    this.dbNum = ~~dbNum[1]
  },
  computed: {
    ...mapGetters('tabs', [
      'allTabs'
    ])
  }
}
</script>

<style scoped lang="scss">
  .data_view_item {
    height: 100%;

    .left {
      width: 150px;
      height: 100%;
      padding: 5px;
      display: flex;
      flex-direction: column;

      .key_list {
        flex-grow: 1;
        border: 1px solid #eee;
        margin-top: 5px;
        background: #fff;
      }
    }
  }
</style>
