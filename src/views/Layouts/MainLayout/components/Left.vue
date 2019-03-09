<template>
  <div class="left noselect">
    <div class="input_search_box">
      <input type="text" class="input_search" v-model="searchText" placeholder="搜索...">
    </div>
    <div class="left_main">
      <div class="left_tabs">
        <div
          class="left_tab_item"
          :class="{active:active==='favorite'}"
          @click="active='favorite'"
        >
          <div>
            <span class="fa fa-star color_warn"></span>
            <span>收藏</span>
          </div>
        </div>
        <div
          class="left_tab_item"
          :class="{active:active==='list'}"
          @click="active='list'"
        >
          <div>
            <!--<span class="fa fa-list color_primary"></span>-->
            <span>服务器列表</span>
          </div>
        </div>
      </div>
      <div class="left_tab_main">
        <div class="config_list">
          <template v-for="config in configList()">
            <div
              class="config_item"
              :key="`${config.name}${config.address}${config.port}${config.createdAt}`"
              v-if="!searchText.length || config.name.includes(searchText) || config.address.includes(searchText)"
              @contextmenu="e=>onShowContextMenu(e,config)"
            >
              <div>{{config.name}}</div>
              <div v-if="config.isFavorite">
                <span class="fa fa-star color_warn"></span>
              </div>
            </div>
          </template>
        </div>
      </div>
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
    onEditConfig () {
      if (!this.tmpConfig) return false
      this.$storage.local.set('tmpEditConfig', this.tmpConfig)
      this.$windowsManager.openCreateConfig()
    },
    onFavoriteConfig () {
      if (!this.tmpConfig) return false
      this.$store.dispatch('redisConfig/toggleFavConfig', this.tmpConfig.createdAt)
      this.tmpConfig = null
    },
    onDeleteConfig () {
      if (!this.tmpConfig) return false
      return new Promise(resolve => {
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除配置吗？',
          onOk () {
            resolve()
          }
        })
      }).then(() => {
        // todo 删除配置后同时关闭相关的连接
        this.$store.dispatch('redisConfig/delConfig', this.tmpConfig.createdAt)
        this.tmpConfig = null
      })
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
    }
  },
  computed: {
    ...mapGetters('redisConfig', [
      'getConfigs',
      'getFavoriteConfigs'
    ])
  },
  mounted () {
    this.$getElectronApp()
      .on('refreshConfigData', () => {
        this.$store.dispatch('redisConfig/readConfigs')
      })
    window.addEventListener('click', (e) => {
      e.preventDefault()
      this.extMenu.show = false
    })
  }
}
</script>

<style scoped lang="scss">
  .left {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
    border-right: 1px solid #e8eaec;

    .input_search_box {
      padding: 10px;

      .input_search {
        width: 100%;
        /*border-radius: 2px;*/
        border: 1px solid #dcdee2;
        outline: none;
        border-radius: 2px;
        font-size: 14px;
        padding: 5px;
        color: #515a6e;
      }
    }

    .left_main {
      flex-grow: 1;
      height: 100%;
      display: flex;
      flex-direction: row;
      padding: 0 5px 5px 5px;
      box-sizing: border-box;

      .left_tabs {
        height: 100%;
        width: 30px;
        box-sizing: border-box;
        border-right: 1px solid #dcdee2;

        .left_tab_item {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 30px;
          padding: 10px 0;
          box-sizing: border-box;
          border: 1px solid rgba(0, 0, 0, 0);
          cursor: pointer;

          & > div {
            font-size: 14px;
            width: 14px;
            text-align: center;
            word-break: break-all;
            line-height: 18px;
            /*writing-mode: vertical-rl;*/
            /*writing-mode: vertical-lr;*/
            /*direction: rtl;*/
            font-weight: bold;
          }

          &.active {
            background: #ffffff;
            border-left: 1px solid #dcdee2;
            border-top: 1px solid #dcdee2;
            border-bottom: 1px solid #dcdee2;
            border-right: 1px solid #ffffff;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }

          &:hover {
            color: #2d8cf0;
          }
        }
      }

      .left_tab_main {
        height: 100%;
        background: #ffffff;
        flex-grow: 1;
        border-top: 1px solid #dcdee2;
        border-right: 1px solid #dcdee2;
        border-bottom: 1px solid #dcdee2;

        .config_list {
          padding: 5px;

          .config_item {
            cursor: pointer;
            padding: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &:hover {
              background: #f8f8f9;
            }
          }
        }
      }
    }
  }
</style>
