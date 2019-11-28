'use strict'

const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vue: ['vue'],
    axios: ['axios']
  },
  output: {
    path: path.resolve(__dirname, '../src/dll'),
    filename: 'dll.[name].[hash].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]', // output.library必须与DllPlugin配置中的name字段保持统一
      path: path.resolve(__dirname, '../src/dll', '[name]-[hash]-manifest.json')
    }),
    // new webpack.optimize.UglifyJsPlugin()
  ]
}
