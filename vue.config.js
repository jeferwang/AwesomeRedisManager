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
        productName: 'AwesomeRedisManager',
        win: {
          icon: 'public/icon.ico',
          artifactName: 'Windows_${productName}Setup_${version}.${ext}'
        },
        mac: {
          icon: 'public/icon.icns',
          artifactName: 'Mac_${productName}Setup_${version}.${ext}'
        },
        linux: {
          // icon: 'public/icon.ico',
          artifactName: 'Linux_${productName}Setup_${version}.${ext}'
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
