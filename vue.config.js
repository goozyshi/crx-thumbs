const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options", "background", "content"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ];
module.exports = {
  assetsDir: 'assets',
  pages: pagesObj,
  filenameHashing: false,
  configureWebpack: {
    plugins: [CopyWebpackPlugin(plugins)]
  },
  // 查看打包组件大小情况
  chainWebpack: config => {
    if (process.env.npm_config_report) {
      config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
};
