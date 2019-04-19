<template>
  <div class="com-select select_box">
    <div class="select_main">
      <input
        type="text"
        class="com-input"
        ref="selectInput"
        :placeholder="placeholder"
        @focus="showList=true"
        @blur="onHideSelectList"
        v-model="showText"
        readonly
      >
    </div>
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      :duration="100"
    >
      <div class="select_list_box" v-if="showList">
        <div class="select_list noselect">
          <template v-for="option in optionList">
            <div
              class="select_item"
              :key="option.key"
              @click="onSelectItem(option)"
            >
              {{option.value}}
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SelectList',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: null,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showList: false,
      optionList: [],
      showText: ''
    }
  },
  methods: {
    onSelectItem (option) {
      console.log(option)
      this.$set(this, 'showText', option.value)
      this.$emit('change', option.key)
      this.$emit('input', option.key)
    },
    onHideSelectList () {
      setTimeout(() => {
        this.showList = false
      }, 100)
    }
  },
  mounted () {
    // 处理传入的options
    let optionList = []
    if (Array.isArray(this.options)) {
      for (let i = 0; i < this.options.length; i++) {
        optionList.push({ key: `${i}`, value: `${this.options[i]}` })
      }
    } else {
      Object.keys(this.options).forEach(key => {
        optionList.push({ key: `${key}`, value: `${this.options[key]}` })
      })
    }
    // 找出初始值
    if (this.value) {
      let showText = null
      for (let i = 0; i < optionList.length; i++) {
        if (optionList[i].key === `${this.value}`) {
          showText = optionList[i].value
          break
        }
      }
      if (showText !== null) {
        this.showText = showText
      }
    }
    this.$set(this, 'optionList', optionList)
  }
}
</script>

<style scoped lang="scss">
  .select_box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .select_main {
      width: 100%;
      height: 100%;

      .com-input {
        width: 100%;
        height: 100%;
        line-height: 100%;
        padding: 0 10px;
      }
    }

    .select_list_box {
      position: relative;
      width: 100%;

      .select_list {
        box-shadow: $shadow-normal;
        position: absolute;
        left: 0;
        top: 5px;
        width: 100%;
        background-color: $background-color-dark;

        .select_item {
          height: $grid-height-small;
          line-height: $grid-height-small;
          padding: 0 10px;
          cursor: pointer;
          border-bottom: 1px solid $border-color;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background-color: $background-color-lighter;
          }
        }
      }
    }
  }
</style>
