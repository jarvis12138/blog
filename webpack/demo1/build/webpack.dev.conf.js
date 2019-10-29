'use strict'

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    // mode: 'production',
    context: path.resolve(__dirname, '../'), // 设置工程根目录
    entry: { // 入口
        app: './src/main.js'
    },
    output: { // 出口
        path: path.resolve(__dirname, '../dist'), // 打包至根目录 dist 文件夹下
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 正则 获取 css 文件
                use: ['style-loader', 'css-loader']
                // use: ExtractTextPlugin.extract({
                //     fallback: 'style-loader',
                //     use: 'css-loader'
                //     // use: ['css-loader?minimize=true']
                //     // use: [{ loader: 'css-loader', options: { minimize: true } }]
                // })
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.scss$/,
                // use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, 'sass-loader']
                use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, { loader: 'postcss-loader', options: { ident: 'postcss', plugins: (loader) => [require('autoprefixer')({ browsers: ['>0.15% in CN'] })] } }, 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000 // 10kb 小于这个大小则打包成base64
                        }
                    },
                    'file-loader']
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                }
            },
            // {
            //     test: require.resolve('jquery'),
            //     use: 'expose-loader?$'
            // },
            // {
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/, // node_modules 文件夹下面的内容不校验
            //     // loader: 'eslint-loader'
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: [
            //                 '@babel/preset-env'
            //             ]
            //         }
            //     }
            // }

        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({ // 引入 html
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
}  