const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    hotOnly: true,
    historyApiFallback: true,
    disableHostCheck: true,
    watchContentBase: true,
    contentBase: path.resolve(__dirname, '.Render'),
    host: '0.0.0.0',
    port: 3000,
    publicPath: '/',
    open: false,
    openPage: ''
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
