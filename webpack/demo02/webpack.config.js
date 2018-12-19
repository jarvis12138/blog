
let path = require('path');

module.exports = {
    entry: './src/index.js',   // 入口
    output: {
        filename: 'build.js',
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
    plugins: [],  // 插件的配置
    mode: 'development', // 可以更改模式
    resolve: {},    // 配置解析
};