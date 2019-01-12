
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let config = {
    entry: path.resolve(__dirname, '../src/main.js'), // 这里要绝对路径
    output: {
        path: path.resolve(__dirname, '../dist'), // 生成到根目录下dist文件夹
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/ // 不包含 node_modules 文件夹下 .vue 文件
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/ // 不包含 node_modules 文件夹下 .vue 文件
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1000 // 小于1kb打包成base64
                        }
                    }
                ],
                exclude: /node_modules/ // 不包含 node_modules 文件夹下 .vue 文件
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html', // 模板为根目录下index.html
            filename: 'index.html', // 生成的html
        }),
        new VueLoaderPlugin()
    ],
    // Issues: https://github.com/vuejs-templates/webpack/issues/215
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    devServer: {
        host: "localhost",
        port: 3000
    },
    devtool: "cheap-module-eval-source-map"
};

module.exports = config;