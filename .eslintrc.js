module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    // html空标签关闭
    'vue/html-self-closing': 'off',
    // html每行最大属性个数
    'vue/max-attributes-per-line': 'off',
    // 单行标签内容换行
    'vue/singleline-html-element-content-newline': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
