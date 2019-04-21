<template>
  <div class="menu_list">
    <div
      class="menu_item"
      v-for="menu in menuList"
      :key="menu.key"
      @click="$emit('select',menu.key)"
    >
      <span class="fa" :class="menu.icon" v-if="menu.icon"></span>
      <span>{{menu.value}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  name: 'CommonExtMenu'
}
</script>

<style scoped lang="scss">
  .menu_list {
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
