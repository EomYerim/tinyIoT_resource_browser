const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     target: 'http://223.131.176.101:3000/',
  //     ws: true,
  //     changeOrigin: true
  //   }
  // }
})
