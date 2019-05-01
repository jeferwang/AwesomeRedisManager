<template>
  <div class="full_screen_mask" @click="e=>$emit('click',e)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FullScreenMask'
}
</script>

<style scoped lang="scss">
  .full_screen_mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: $background-color-mask;
  }
</style>
