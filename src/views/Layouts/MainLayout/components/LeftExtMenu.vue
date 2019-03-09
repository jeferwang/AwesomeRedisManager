<template>
  <div class="left_ext_menu">
    <div class="menu_item" @click="$emit('favorite')">
      <span class="fa fa-star-o"></span>
      <span>{{config && config.isFavorite?'取消收藏':'收藏'}}</span>
    </div>
    <div class="menu_item" @click="$emit('edit')">
      <span class="fa fa-pencil-square-o"></span>
      <span>编辑</span>
    </div>
    <div class="menu_item" @click="$emit('delete')">
      <span class="fa fa-trash-o"></span>
      <span>删除</span>
    </div>
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
      padding: 5px 10px;
      border-bottom: 1px solid #dcdee2;
      cursor: pointer;

      .fa{
        margin-right: 5px;
      }

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
