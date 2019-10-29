
# webpack基础配置解析

打算写一个讲解 `vue` 中 `webpack` 配置的系列教程，争取每一步都能分析到，可能有点枯燥，希望能写完。。。

言归正传，既然我们是分析 `vue2.x` 版本的 `webpack` 配置，虽然 `webpack` 已经到4了，这里还是用 `webpack3.x` 来讲解吧。

从零开始，首先创建一个文件夹放置项目，然后执行 `npm init -y` 初始化，他会生成一个 `package.json` 的文件。

## 创建一个本地运行环境

一般来说，我们做一个项目，肯定会有一个本地能运行的调试环境，等所有代码在本地运行测试通过后，我们才能部署线上。`webpack` 的启动本地的插件叫 `webpack-dev-server` ，还要打包 `html` 需要的 `html-webpack-plugin` ，执行

```
npm install webpack@3 -D
npm install webpack-dev-server@2 -D
npm install html-webpack-plugin -D
```

> 这里 `-D` 和 `-S` 的区别，可以搜索 `npm dependencies devDependencies` 区别。简单来说就是 `-D` 只在本地运行环境存在， `-S` 会打包到代码中。

至此插件安装好了，创建js文件 `src/main.js` ，HTML文件 `index.html` ，配置文件 `build/webpack.dev.conf.js` 。

配置 `webpack` 的入口、出口和对应的 `html` ，简易的本地运行就搭建好了。

```js
// build/webpack.dev.conf.js

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
```

我们知道， `vue` 中执行 `npm run dev` 就启动了本地环境，因此只需在 `package.json` 的 `scripts` 中添加

```js
  "scripts": {
    // webpack-dev-server 代表启动 webpack-dev-server 
    // --inline 应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
    // --progress 将运行进度输出到控制台。
    // --config 允许你修改配置文件位置 例如，如果不加这个，那么配置文件就必须叫 webpack.config.js ，而且必须在根目录下，因为 webpack 默认 webpack.config.js 在根目录。
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
  }
```

在 `src/main.js` 中写入 `console.log(222)` ，然后执行 `npm run dev` ，就能在 `http://localhost:8080/` 访问成功！

## 打包代码

参考上一步，新建 `build\build.js` 。

```js
// build\build.js
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
```

可以看出，相差不大。

## 引入css

一个项目肯定有 `css` 。样式有行内样式、内联样式、外联样式； `css` 有 `css` 、 `less` 、 `sass` 、 `scss` 。

创建 `style/common.css` 、 `style/a.less` 、 `style/a.scss` 。

```css
/* style/common.css */
body {
    background-color: red;
}

/* style/a.less */
a {
    color: red;
}

/* style/a.scss */
a {
  color: blue;
}
```

先从引入 `style/common.css` 开始，在 `src/main.js` 中添加 `import '../style/common.css'` 。要解析这个文件，需要先安装 `css-loader` 还需要将 `style` 样式以 `<style>` 标签的形式插入 `html` 中需要 `style-loader` 。

```
npm install css-loader -D
npm install style-loader -D
```

在 `build/webpack.dev.conf.js` 中添加

```js
// build/webpack.dev.conf.js

    module: {
        rules: [
            {
                test: /\.css$/, // 正则 获取 css 文件
                use: ['style-loader', 'css-loader'] // 注意这里是从右往左执行，先执行 css-loader 再执行 style-loader
            }
        ]
    },
```

这样就可以将 `css` 以 `<style>` 标签的形式插入 `html` 文件中。

第二个引入 `style/a.less` ，在 `src/main.js` 中添加 `import '../style/a.less'` 。要解析这个文件还需要安装 `less` `less-loader` 。

```
npm install css-loader -D
npm install style-loader -D
npm install less -D
npm install less-loader -D
```

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
```

第三个引入 `style/a.scss` ，在 `src/main.js` 中添加 `import '../style/a.scss'` 。要解析这个文件还需要安装 `node-sass` `sass-loader` 。

```
npm install css-loader -D
npm install style-loader -D
npm install node-sass -D
npm install sass-loader -D
```

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
```

好了，引入了 `.css` 、 `.less` 、 `.scss` 。但如果我们想在浏览器查看这个css样式是哪个文件设置的，比如想知道 `body{color: red;}` 来自哪个css文件，则需要添加属性 `sourceMap` ：

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.scss$/,
                use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, 'sass-loader']
            }
```

另外，某些 `css3` 属性有兼容性问题，需要加上前缀，那么能不能通过配置文件自动添加呢？答案肯定是：可以的！

```js
// 引入 postcss
npm install postcss-loader -D
// 引入 autoprefixer 添加css3前缀，解决浏览器兼容性问题
npm install autoprefixer -D
```

测试下，给 `style/a.scss` 添加 `display: flex;` 。修改配置：

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.scss$/,
                use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, { loader: 'postcss-loader', options: { ident: 'postcss', plugins: (loader) => [require('autoprefixer')({ browsers: ['>0.15% in CN'] })] } }, 'sass-loader']
            }
```

同时，你可能想拥有一个公共的 `common.css` 库，以便各个地方的引用。这里有点不同，在 `webpack4.x` 中解决这个问题引入的库是 `mini-css-extract-plugin` ，在 `webpack1-3` 中引入的库是 `extract-text-webpack-plugin` 。

```js
npm install extract-text-webpack-plugin -D
```

修改配置：

```js
// build/webpack.dev.conf.js 中添加
const ExtractTextPlugin = require('extract-text-webpack-plugin')

            {
                test: /\.css$/, // 正则 获取 css 文件
                // use: ['style-loader', 'css-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },

// plugins 添加
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
```

这样，就可以将所有的 `.css` 结尾文件融进一个 `style.css` 文件中。

还有我们要压缩 `css` 该怎么配置呢？

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.css$/, // 正则 获取 css 文件
                // use: ['style-loader', 'css-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                    // use: ['css-loader?minimize=true']
                    // use: [{ loader: 'css-loader', options: { minimize: true } }]
                })
            }
```

总结一下，在 `css` 中你可能遇到的问题有：

```
1、css类型问题，比如less、scss
2、判断css样式来源于哪个文件，用于定位代码
3、css兼容性问题
4、设置共用css
5、css压缩
```

## 引入图片、字体

在 `style/common.css` 中添加样式 `background-image: url('../src/assets/logo.png');` 需要添加配置：

```js
npm install file-loader -D
```

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
```

但有的图片比如 `icon` 是非常小的，我们可不可以把它处理成base64呢？

需要安装 `url-loader` 

```js
npm install url-loader -D
```

```js
// build/webpack.dev.conf.js 中添加

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
            }
```

同时，对于字体也一样

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                }
            }
```

`mp3` 、 `mp4` 

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                }
            },
```

## eslint代码检测

想要对代码进行检测需要两个插件：

```js
npm install eslint -D
npm install eslint-loader -D
```

修改配置：

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader'
            }
```

同时还需要创建一个 `.eslintrc` 文件。

ESLint支持多种格式的配置文件：

> JavaScript : 使用 `.eslintrc.js` 导出配置对象
>
> YAML : 使用 `.eslintrc.yaml` 或 `.eslintrc.yml` 定义配置结构
>
> JSON : 使用 `.eslintrc.json` 定义配置结构，这个文件允许JavaScript样式的注释。
>
> 不推荐使用 `.eslintrc` 

所以，我们在本目录创建一个 `./.eslintrc.js` ，这里我们直接复制 `vue` 项目中的 `.eslintrc.js` 。

可能还有一些文件要忽略不需要做代码检测，就可以在根目录创建 `.eslintignore` ，直接复制 `vue` 项目中的 `.eslintignore` 。

如果项目中使用了ES6语法，比如我们使用了 `import` 引入 `css` 。再进行代码检测还需要插件：

```js
npm install babel-eslint -D
```

在 `.eslintrc.js` 中添加 `parser: 'babel-eslint'` (注意，加入的位置是代码根对象)

## ES6转ES5

ES6转ES5需要插件：

```js
npm install babel-loader -D
// 如果你的版本是：babel-loader@8.x
npm install @babel/core -D
npm install @babel/preset-env -D
// 低版本使用：
npm install babel-core -D
npm install babel-preset-env -D
```

在 `./src/main.js` 中加入测试代码：

```js
const fn = () => {
    console.log('es6')
}
fn()
```

添加配置：

```js
// build/webpack.dev.conf.js 中添加

            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/, // node_modules 文件夹下面的内容不校验
                // loader: 'eslint-loader'
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            }
```

或者创建 `.babelrc` 文件。

[可参考：Babel 入门教程- 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/01/babel.html)

## webpack跨域问题

```js
// build/webpack.dev.conf.js 中添加

    devServer: {
        proxy: {
            '/api': {
                target: 'http://www.baidu.com'
                // pathRewrite: {'/api': ''}
            }
        }
    }
```

## 全局变量引入问题

你可以通过 `npm install jquery -S` 引入 `jQuery` 。

```js
import $ from 'jquery'

console.log($) // jquery
console.log(window.$) // 全局 undefined
```

```js
import $ from 'expose-loader?$!jquery'

console.log($) // jquery
console.log(window.$) // jquery
```

```js
            {
                test: require.resolve('jquery'),
                use: 'expose-loader?$'
            },

import $ from 'jquery'

console.log($) // jquery
console.log(window.$) // jquery
```

```js
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
    ]

// import $ from 'jquery'

console.log($) // jquery
console.log(window.$) // 全局 undefined
```

```js
// CDN
// https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.js

import $ from 'jquery'

console.log($) // jquery
console.log(window.$) // jquery

    externals: {
        jquery: "jQuery"
    }

```
