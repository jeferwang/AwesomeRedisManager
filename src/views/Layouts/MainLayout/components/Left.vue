<template>
  <div class="left no-select">
    <div class="input_search_box">
      <div class="tip_text">Filter</div>
      <input type="text" class="com-input input_search" v-model="searchText" placeholder="Please input filter">
    </div>
    <div class="config_list">
      <template v-for="config in configList()">
        <div
          class="config_item"
          :class="{context_menu:tmpConfig && tmpConfig.createdAt===config.createdAt && extMenu.show}"
          :key="`${config.name}${config.host}${config.port}${config.createdAt}`"
          v-if="!searchText.length || config.name.includes(searchText)"
          @contextmenu="e=>onShowContextMenu(e,config)"
          @click="onCreateConnect(config)"
        >
          <div>{{config.name}}</div>
          <div v-if="config.isFavorite">
            <span class="fa fa-star color_warn"></span>
          </div>
        </div>
      </template>
    </div>
    <LeftExtMenu
      v-if="extMenu.show"
      :style="{left:`${extMenu.x}px`,top:`${extMenu.y}px`}"
      :config="tmpConfig"
      @favorite="onFavoriteConfig"
      @edit="onEditConfig"
      @delete="onDeleteConfig"
    ></LeftExtMenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LeftExtMenu from './LeftExtMenu'

export default {
  name: 'Left',
  data () {
    return {
      active: 'list',
      extMenu: {
        show: false,
        x: 0,
        y: 0
      },
      tmpConfig: null,
      searchText: ''
    }
  },
  components: {
    LeftExtMenu
  },
  methods: {
    async onCreateConnect (config) {
      this.$emit('start-connect')
      const res = await this.$store.dispatch('tabs/addTabByConfig', config)
      if (!res) {
        this.$msg.msgBox({ msg: '连接失败', type: 'warning' })
      }
      this.$emit('end-connect')
    },
    onEditConfig () {
      if (!this.tmpConfig) return false
      this.$storage.local.set('tmpEditConfig', this.tmpConfig)
      this.$emit('show-create-config')
    },
    onFavoriteConfig () {
      if (!this.tmpConfig) return false
      this.$store.dispatch('redisConfig/toggleFavConfig', this.tmpConfig.id)
      this.tmpConfig = null
    },
    onDeleteConfig () {
      if (!this.tmpConfig) return false
      // todo 删除配置后同时关闭相关的连接
      this.$store.dispatch('redisConfig/delConfig', this.tmpConfig.id)
      this.tmpConfig = null
    },
    onShowContextMenu (e, config) {
      e.preventDefault()
      this.tmpConfig = config
      this.extMenu.x = e.x + 5
      this.extMenu.y = e.y + 5
      this.extMenu.show = true
    },
    configList () {
      switch (this.active) {
        case 'list':
          return this.getConfigs
        case 'favorite':
          return this.getFavoriteConfigs
      }
    },
    hideExtMenuListener (e) {
      if (this.extMenu.show) {
        this.extMenu.show = false
      }
    }
  },
  computed: {
    ...mapGetters('redisConfig', [
      'getConfigs',
      'getFavoriteConfigs'
    ])
  },
  mounted () {
    window.addEventListener('click', this.hideExtMenuListener)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.hideExtMenuListener)
  }
}
</script>

<style scoped lang="scss">
  .left {
    display: flex;
    flex-direction: column;
    border-right: 1px solid $border-color;

    .input_search_box {
      height: $grid-height-normal;
      width: 100%;
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid $border-color;

      .tip_text {
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        background-color: $background-color-dark;
        font-size: 14px;
        padding: 0 10px;
      }

      .input_search {
        flex-grow: 1;
        border: none;
        font-size: 14px;
        padding: 5px;
        text-align: center;
      }
    }

    .config_list {
      color: $text-color-light;

      .config_item {
        padding: 0 10px;
        height: $grid-height-normal;
        line-height: $grid-height-normal;
        border-bottom: 1px solid $border-color;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;

        &:hover {
          background: $background-color-highlight-blue;
        }

        &.context_menu {
          background: $background-color-highlight-blue;
        }

      }
    }
  }
</style>
