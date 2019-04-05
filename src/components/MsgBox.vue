<template>
  <transition
    name="fade"
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
    :duration="500"
  >
    <div
      class="msg_box"
      @click="onHide"
      v-show="show"
    >
      <div class="icon noselect">
        <i
          class="fa fa-check-circle"
          v-if="type==='success'"
        ></i>
        <i
          class="fa fa-exclamation-circle"
          v-if="type==='warning'"
        ></i>
        <i
          class="fa fa-commenting"
          v-if="type==='info'"
        ></i>
      </div>
      <div class="text">
        {{msg}}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ActionList',
  props: {
    //   选项列表
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    onHide (e) {
      this.show = false
      setTimeout(() => {
        this.$emit('close')
      }, 500)
    }
  },
  mounted () {
    this.show = true
    setTimeout(() => {
      this.onHide()
    }, this.duration)
  }
}
</script>

<style lang="scss" scoped>
.msg_box {
  position: fixed;
  right: 10px;
  bottom: 35px;
  padding: 10px;
  background-color: $background-color;
  box-shadow: $shadow-normal;
  width: 300px;
  min-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  .icon {
    margin-right: 10px;
    font-size: 30px;
    .fa-check-circle {
      color: $common-color-success;
    }
    .fa-exclamation-circle {
      color: $common-color-warning;
    }
    .fa-commenting {
      color: $common-color-primary;
    }
  }
  .text {
    // word-break: break-all;
    font-size: 14px;
  }
}
</style>
