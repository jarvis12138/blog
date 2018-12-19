
let path = require('path');
// webpack插件 将html打包到build下并且可以自动引入生产的js
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 删除build文件夹重新打包
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // entry: ['./src/index.js', './src/a.js'],   // 多个js文件打包成一个js
    entry: {   // 多个js文件打包成多个js
        index: './src/index.js',
        a: './src/a.js'
    },
    output: {
        filename: '[name].[hash:8].js',   // [name]: 多个js文件打包成多个js
        // 路径必须是绝对路径
        path: path.resolve('./build')
    },  // 出口
    devServer: {
        // 设置打开主路径
        contentBase: './build',
        // port: 3000   // 修改端口号
        // compress: true   // 是否服务器压缩
        // open: true      // 是否自动打开浏览器
        // hot: true       // 是否热更新
    }, // 开发服务器
    module: {},   // 模块配置
    plugins: [
        new CleanWebpackPlugin(['./build']),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'a.html',
            chunks: ['index']
            // hash: true   // ***.js?6d6s8d9
            // minify: {
            //     collapseWhitespace: true   // 去除空白的压缩
            // }
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'b.html',
            chunks: ['index', 'a']
        })
    ],  // 插件的配置
    mode: 'development', // 可以更改模式
    resolve: {},    // 配置解析
};