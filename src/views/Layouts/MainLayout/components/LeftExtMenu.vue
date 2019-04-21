<template>
  <div class="left_ext_menu">
    <div class="menu_item" @click="$emit('favorite')">
      <span class="fa fa-star-o"></span>
      <span>{{config && config.isFavorite?'Cancel collection':'Collection'}}</span>
    </div>
    <div class="menu_item" @click="$emit('edit')">
      <span class="fa fa-pencil-square-o"></span>
      <span>Edit</span>
    </div>
    <div class="menu_item" @click="$emit('delete')">
      <span class="fa fa-trash-o"></span>
      <span>Delete</span>
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
    position: fixed;
    border: 1px solid $border-color;
    background: $background-color;
    box-shadow: $shadow-normal;

    .menu_item {
      min-width: 150px;
      padding: 0 10px;
      height: $grid-height-small;
      line-height: $grid-height-small;
      border-bottom: 1px solid $border-color;
      cursor: pointer;

      .fa {
        margin-right: 5px;
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: $background-color-highlight-blue;
        color: $text-color-light;
      }
    }
  }
</style>
