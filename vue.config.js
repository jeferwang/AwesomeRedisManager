module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/style/variable.scss";`
      }
    }
  }
}
