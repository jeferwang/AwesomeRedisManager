<template>
  <div class="simple_panel" @click="e=>$emit('click',e)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SimplePanel'
}
</script>

<style scoped lang="scss">
  .simple_panel {
    box-shadow: $shadow-normal;
    background: $background-color;
    overflow: hidden;
    overflow-y: auto;
    width: 640px;
    height: 480px;
  }
</style>
