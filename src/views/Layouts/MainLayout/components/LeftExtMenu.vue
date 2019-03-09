<template>
  <div class="left_ext_menu">
    <div class="menu_item" @click="$emit('favorite')">{{config && config.isFavorite?'取消收藏':'收藏'}}</div>
    <div class="menu_item" @click="$emit('edit')">编辑</div>
    <div class="menu_item" @click="$emit('delete')">删除</div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: null
    }
  },
  name: 'LeftExtMenu'
}
</script>

<style scoped lang="scss">
  .left_ext_menu {
    position: absolute;
    border: 1px solid #dcdee2;
    background: #ffffff;

    .menu_item {
      min-width: 100px;
      padding: 5px;
      border-bottom: 1px solid #dcdee2;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #2d8cf0;
        color: #ffffff;
      }
    }
  }
</style>
