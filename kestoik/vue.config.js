const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: path.resolve(__dirname, 'src/preload.js'),
    },
  },
});
