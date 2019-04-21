<template>
  <div class="status_bar no-select">
    <div class="left"></div>
    <div class="right">
      <div class="current_db" v-if="this.activeTab">
        <div>Current DB </div>
        <div class="btn_change_db" @click="onSelectDb">
          <span>{{currentDb}}</span>
          <span class="fa fa-arrows-v"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StatusBar',
  computed: {
    ...mapGetters('tabs', ['activeTab']),
    currentDb () {
      return this.activeTab.connect.condition.select
    }
  },
  methods: {
    async onSelectDb () {
      let totalNum = await this.getDbNum()
      let actionList = Array.from({ length: totalNum }, (item, index) => index.toString())
      this.$popup.actionList({ tipText: 'Please select DB', actionList: actionList }).then(res => {
        this.activeTab && this.activeTab.connect.select(res.action)
        this.$eventBus.$emit('change-db')
      })
    },
    async getDbNum () {
      if (!this.activeTab) {
        return 0
      }
      let readRes = await this.activeTab.connect.config('get', 'databases')
      if (readRes.length !== 2) {
        return 0
      }
      return ~~readRes[1]
    }
  }
}
</script>

<style scoped lang="scss">
  .status_bar {
    background: $common-color-primary-dark;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .right {
      height: 100%;
      .current_db {
        height: 100%;
        display: flex;
        align-items: center;
        .btn_change_db {
          cursor: pointer;
          padding: 0 10px;
          height: 100%;
          display: flex;
          align-items: center;
          .fa {
            margin-left: 5px;
          }

          &:hover {
            background: $common-color-primary;
          }
        }
      }
    }
  }
</style>
