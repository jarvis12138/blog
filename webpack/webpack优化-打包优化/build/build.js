'use strict'

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  context: path.resolve(__dirname, '../'), // 设置工程根目录
  entry: { // 入口
    app: './src/main.js',
  },
  output: { // 出口
    path: path.resolve(__dirname, '../dist'), // 打包至根目录 dist 文件夹下
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, '../src/dll/axios-9227eb4374adce300603-manifest.json')
    // }),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, '../src/dll/vue-9227eb4374adce300603-manifest.json')
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      filename: 'index.html'
    }),
    // new BundleAnalyzerPlugin()
  ]

}