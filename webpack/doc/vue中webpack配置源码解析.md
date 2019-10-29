
# vue中webpack配置源码解析

本文将按照 `package.json` 中 `scripts` 中的配置解析。

## npm run dev

我们知道，写入 `scripts` 中的变量可以通过 `npm run XXX` 的形式执行，所以这里就是执行 `webpack-dev-server --inline --progress --config build/webpack.dev.conf.js` 。

拆解下 `webpack-dev-server` 是通过 `express` 启动的一个本地服务 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 。其中的 `--inline` 表示应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。 `--progress` 表示显示打包的进度。 `--config` 表示配置文件的位置，如果不加的话，你就只能在项目根目录创建配置文件 `webpack.config.js` ， `webpack.config.js` 是 `webpack` 的默认配置。这里包含一个 `development` 、 `production` 等多个模式的公共配置项 `webpack.base.conf.js` ，我们先跳到这看下。。。

```js
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
```

`process` 是 `node` 的全局变量，并且有 `process.env` 这个属性，可以执行 `node process.env` 查看，但没有 `NODE_ENV` 、 `HOST` 等。

但 `process.env` 来自这里：

```js
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    })
  ]
```

`DefinePlugin` 定义全局变量 `process.env` 。

接下来通过 `merge` 合并两个对象：

```js
const devWebpackConfig = merge(baseWebpackConfig, {
  // ...
});
```

`module.rules` ：

```js
  module: {
    rules: utils.styleLoaders({ sourceMap: true, usePostCSS: true })
  }



// 输出：
[{
  test: /\.css$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } }]
},
{
  test: /\.postcss$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } }]
},
{
  test: /\.less$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      { loader: 'less-loader', options: { sourceMap: true } }]
},
{
  test: /\.sass$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      {
        loader: 'sass-loader',
        options: { indentedSyntax: true, sourceMap: true }
      }]
},
{
  test: /\.scss$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      { loader: 'sass-loader', options: { sourceMap: true } }]
},
{
  test: /\.stylus$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      { loader: 'stylus-loader', options: { sourceMap: true } }]
},
{
  test: /\.styl$/,
  use:
    ['vue-style-loader',
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      { loader: 'stylus-loader', options: { sourceMap: true } }]
}]
// node 打印深层属性
// const util = require('util')
// console.log(util.inspect(myObject, {showHidden: false, depth: null}))
// // alternative shortcut
// console.log(util.inspect(myObject, false, null, true /* enable colors */))
```

`devtool` :

```js
  devtool: config.dev.devtool,

// 显示 原始源代码（仅限行）
  devtool: 'cheap-module-eval-source-map',
```

`devServer` 是 `webpack-dev-server` 设置：

```js
  devServer: {
    clientLogLevel: 'warning', // 当使用内联模式(inline mode)时，会在开发工具(DevTools)的控制台(console)显示消息
    historyApiFallback: { // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。devServer.historyApiFallback 默认禁用。
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true, // 启用 webpack 的 模块热替换 功能
    contentBase: false, // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。
    compress: true, // 一切服务都启用 gzip 压缩
    host: HOST || config.dev.host, // host
    port: PORT || config.dev.port, // port 启动服务的端口
    open: config.dev.autoOpenBrowser, // 告诉 dev-server 在 server 启动后打开浏览器。默认禁用。
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, // 代理
    quiet: true, // 启用 devServer.quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。
    watchOptions: { // 与监视文件相关的控制选项
      poll: config.dev.poll,
    }
  }
```

`plugins` 中：

```js
/*
  模块热替换(Hot Module Replacement 或 HMR)

  当上面的 devServer中 hot:true时, 这个模块必须存在,不然webpack会报错.
  这个模块结合上面的hot是用于,
  检测到页面更新,在不刷新页面的情况下替换内容,
  如果hot: true与这个模块均不存在, 则跟旧版本的 dev-middleware/hot-*一样,修改即会刷新
*/
new webpack.HotModuleReplacementPlugin(),

// 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
new webpack.NamedModulesPlugin(),

// 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
new webpack.NoEmitOnErrorsPlugin(),

// 这个插件是用于复制文件和文件夹,在这里是将静态文件夹的内容拷贝一份在开发环境中
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, '../static'),
    to: config.dev.assetsSubDirectory,
    // 忽略拷贝的内容(具体的文件名或模糊的路径)
    ignore: ['.*']
  }
])
```

## webpack.base.conf.js

首先是一个简单的获取文件全路径的函数：

```js
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
```

然后是一段对 `.js` 、 `.vue` 文件的 `eslint` 代码检测配置：

```js
const createLintingRule = () => ({
  test: /\.(js|vue)$/, // 对 .js 、 .vue 文件进行检测
  loader: 'eslint-loader', // 使用的loader是：eslint-loader
  enforce: 'pre', // https://webpack.js.org/configuration/module/#ruleenforce 设置loader的执行顺序
  include: [resolve('src'), resolve('test')], // 包含src下和test下所有符合条件的文件的代码都要执行检测
  options: {
    formatter: require('eslint-friendly-formatter'), // 可以让eslint的错误信息出现在终端上
    emitWarning: !config.dev.showEslintErrorsInOverlay // 调取的是 config/index.js 下 dev.showEslintErrorsInOverlay 看下错误和警告信息是否要打印到浏览器上
  }
})
```

类似于：

```js
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ]
  }
```

放入：

```js
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : [])
    ]
  }
```

`...()` 是扩展运算符， [参考：阮一峰 ECMAScript 6 入门 - 扩展运算符](https://es6.ruanyifeng.com/#docs/array#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 。 `config.dev.useEslint` 判断是否使用 `eslint` 。

下面一段是 `webpack` 公共配置：

```js
module.exports = {
  context: path.resolve(__dirname, '../'), // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader，默认使用当前目录。
  entry: { // 入口
    app: './src/main.js' // 只有一个入口文件 src/main.js
  },
  output: { // 出口
    path: config.build.assetsRoot, // 对应一个绝对路径 配置项：path.resolve(__dirname, '../dist')
    filename: '[name].js', // 出口文件名
    // publicPath: 为项目中的所有资源指定一个基础路径
    // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。例如： 'App.vue' 可以写成 import 'App'
    alias: { // 配置别名，在项目中可缩减引用路径。例如： import HelloWorld from '@/components/HelloWorld' 表示引入 './src/components/HelloWorld'
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      // ...
    ]
  },
  node: { // 以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty', // 设置成empty则表示提供一个空对象
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
```

**`path`与`publicPath`**

`path` : 项目打包目录（这里即是： `根目录/dist` 下）

`publicPath` : 它会为所有的资源指定一个基础路径。设置了publicPath后，会为资源添加一个前缀。 

```js
// 例如：
output: {
  publicPath: '/ss/',
  filename: 'static/js/app.js'
}
// 那么，全路径为： /ss/static/js/app.js
// 即，所有的静态文件的地址都要加 /ss/
```

**`resolve.alias`**

```js
alias: {
  'vue$': 'vue/dist/vue.esm.js',
  '@': resolve('src'),
}
```

设置之后，就可以在 `src\router\index.js` 中通过

```js
import HelloWorld from '@/components/HelloWorld'
```

引入 `HelloWorld.vue` 组件。

**`module.rules`** 是对 `.vue` 、 `.js` 、 `图片` 、 `音视频` 、 `字体` 文件的检测：

**`vueLoaderConfig`** 来自于 `./build/vue-loader.conf.js` 是一些对 `.vue` 文件的options配置。

**`utils.cssLoaders`** 调用了 `./build/utils.js` 中函数 `cssLoaders` 。 `production` 环境下传入

```js
cssLoaders({
  sourceMap: true,
  extract: true
})
```

函数可以解析为：

```js
return {
  css: ExtractTextPlugin.extract({
    use: {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    fallback: 'vue-style-loader'
  })

  // 太多了。。。总之是一些vue文件中对css的处理
}
```

```js
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
```

公共基础配置讲完---

`static文件夹`与`assets文件夹`的区别

在 `build\webpack.prod.conf.js` 中，有：

```js
// copy custom static assets
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, '../static'),
    to: 'static',
    ignore: ['.*']
  }
])
```

这段代码的意思是将 `根目录/static` 文件夹下的静态文件（如：img、js等）直接复制到 `根目录/dist/static` 文件夹下。

```js
// 测试一下
// 如果同时在static和assets文件夹下都拥有logo.png (static/logo.png 、 src/assets/logo.png)
// 在 App.vue 中 引入：
<img src="./assets/logo.png" />
// npm run build 打包之后
// 会在 dist 文件夹下，将 根目录/static/logo.png 复制到 根目录/dist/static/logo.png （纯复制，文件名也不会改变），将 根目录/src/assets/logo.png 图片打包到 根目录/dist/static/img/logo.541071f.png
```

`assets文件夹` 下的图片之所以会打包成这种格式是因为：

```js
// build\webpack.base.conf.js
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    // 这里： img/[name].[hash:7].[ext]
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
  }
}
```

## npm run build

`npm run build` 执行在 `build/build.js` 文件。

```js
  webpack(webpackConfig, (err, stats) => {
    // 中间是一些打包进度的提示语
  })
```

配置信息在 `webpack.prod.conf.js` 中。

其中的大部分配置与 `webpack.base.conf.js` 都差不多，这里特别看下打包生成的文件路径问题。执行 `npm run build` 后，会生成：

```
├── dist
│   ├── static
│       ├── css
│       ├── img
│       ├── js
│   ├── index.html
```

打包生成的 `dist` 文件夹来自于：

```js
  output: {
    path: config.build.assetsRoot, // assetsRoot为根目录下的 dist 文件夹
  }
```

打包生成的 `static` 文件夹来自于：

```js
// build\utils.js
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path) // return 的是 ./static/
}

// build\webpack.prod.conf.js
output: {
  path: config.build.assetsRoot,
  filename: utils.assetsPath('js/[name].[chunkhash].js'),
  chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
}
```

所以，想修改 `static` 的文件名，就是修改 `config.build.assetsSubDirectory` 。

打包生成的 `js` 文件来自于：

```js
// build\webpack.prod.conf.js
output: {
  path: config.build.assetsRoot,
  filename: utils.assetsPath('js/[name].[chunkhash].js'),
  chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
}
```

打包生成的 `css` 文件来自于：

```js
// build\webpack.prod.conf.js
output: {
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
    }),
}
```

打包生成的 `img` 文件来自于：

```js
// build\webpack.base.conf.js
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
```

其他 `mp3` 、 `mp4` 、 `字体` 也可以在这里修改。

```js
// build\webpack.base.conf.js
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
```
