'use strict'

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, '../'), // 设置工程根目录
    entry: { // 入口
        app: './src/main.js'
    },
    output: { // 出口
        path: path.resolve(__dirname, '../dist'), // 打包至根目录 dist 文件夹下
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({ // 引入 html
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
}  