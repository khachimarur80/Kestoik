const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        extraResources: ['src'],
        appId: 'Kestoik.com',
        mac: {
          icon: 'src/assets/logo.icns'
        }
      },
    },
  },
});
