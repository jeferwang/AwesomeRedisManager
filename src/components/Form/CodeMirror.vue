<template>
  <div class="code_mirror">
    <textarea ref="textarea" style="display: none;"></textarea>
    <div class="loading_text" v-if="loading">Loading...</div>
  </div>
</template>

<script>
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/mode/lua/lua.js'
import cm from 'codemirror/lib/codemirror'

export default {
  name: 'CodeMirror',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      loading: true,
      content: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.content = this.value
      this.editor = cm.fromTextArea(this.$refs.textarea, {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: 'darcula'
      })
      this.editor.on('change', editor => {
        this.$emit('input', editor.getValue())
      })
      this.loading = false
    }, 500)
  }
}
</script>

<style scoped lang="scss">
  @import '../../../node_modules/codemirror/lib/codemirror.css';
  @import '../../../node_modules/codemirror/theme/darcula.css';

  .loading_text {
    text-align: center;
    padding: 10px;
  }
</style>
