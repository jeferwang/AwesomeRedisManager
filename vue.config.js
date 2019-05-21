/* eslint-disable no-template-curly-in-string */
module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: false
    },
    electronBuilder: {
      builderOptions: {
        productName: 'Awesome Redis Manager',
        win: {
          icon: 'public/icon.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        mac: {
          icon: 'public/mac_512x512.icns',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        linux: {
          icon: 'public/icon.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        }
      }
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
