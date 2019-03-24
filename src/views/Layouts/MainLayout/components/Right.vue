<template>
  <div class="right">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Right'
}
</script>

<style scoped lang="scss">
  .right {
    height: 100%;
    flex-grow: 1;
    width: calc(100% - 250px);
  }
</style>
