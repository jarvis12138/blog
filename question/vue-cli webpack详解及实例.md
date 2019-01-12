
# 一、前言

因为公司有将vue单页应用改成多页的需求（坑！），如果所有配置全部自己重新配置的话，还不一定比vue-cli官方脚手架好，所以就有在原架构上直接修改的想法。

下面这篇是整理的配置信息详解，纯干货。

第一部分是vue-cli官方配置的代码详细解读，确实比较繁琐，相当于是一份配置文档说明书了，不想看的话可以直接看下面的运行过程讲解。

# 二、创建应用

我们知道，通过 `vue init webpack test` 就创建了一个vue单页应用。

这是他的目录结构：

```
├─build
├─config
├─dist
├─node_modules
├─src
│ ├─assets
│ ├─components
│ ├─router
│ ├─App.vue
│ ├─main.js
├─static
├─test
├─.babelrc
├─.editorconfig
├─.eslintignore
├─.eslintrc.js
├─.gitignore
├─.postcssrc.js
├─index.html
├─package-lock.json
├─package.json
└─README.md
```

下面是单个文件解析部分：

## 1、package.json

```javascript
{
  "name": "test",   // 项目名称
  "version": "1.0.0",   // 项目版本号
  "description": "A Vue.js project",   // 项目描述
  "author": "***",   // 作者名字
  "private": true,   // 是否私有
  // "scripts"部分为我们在控制台运行的脚本,如：npm run dev
  "scripts": {
    // webpack-dev-server：启动了http服务器，实现实时编译;
    // progress：显示打包的进度
    // 访问的是 build/webpack.dev.conf.js
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    // node 执行build/build.js
    "build": "node build/build.js"
  },
  // 项目依赖库 使用--save
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
  // 开发依赖库 使用--save-dev
  "devDependencies": {
    "autoprefixer": "^7.1.2", // autoprefixer作为postcss插件用来解析CSS补充前缀，例如 display: flex会补充为display:-webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex。
    "babel-core": "^6.22.1", // babel的核心，把 js 代码分析成 ast ，方便各个插件分析语法进行相应的处理。
    "babel-eslint": "^8.2.1", // 对所有有效的babel代码进行lint处理。
    "babel-helper-vue-jsx-merge-props": "^2.0.3", // 预制babel-template函数，提供给vue,jsx等使用
    "babel-loader": "^7.1.1", // 使项目运行使用Babel和webpack来传输js文件，使用babel-core提供的api进行转译
    "babel-plugin-dynamic-import-node": "^1.2.0", // Babel插件将import()转换为require()
    "babel-plugin-syntax-jsx": "^6.18.0", // 支持jsx
    "babel-plugin-transform-es2015-modules-commonjs": "^6.26.0", // 将ES2015模块转换为CommonJS
    "babel-plugin-transform-runtime": "^6.22.0", // 避免编译输出中的重复，直接编译到build环境中
    "babel-plugin-transform-vue-jsx": "^3.5.0", // babel转译过程中使用到的插件，避免重复
    "babel-preset-env": "^1.3.2", // 转为es5，transform阶段使用到的插件之一
    "babel-preset-stage-2": "^6.22.0", // ECMAScript第二阶段的规范
    "chalk": "^2.0.1", // 用来在命令行输出不同颜色文字
    "chromedriver": "^2.27.2", // Selenium ChromeDriver的包装器
    "copy-webpack-plugin": "^4.0.1", // 拷贝资源和文件
    "cross-spawn": "^5.0.1", // spawn和spawnSync的跨平台解决方案。
    "css-loader": "^0.28.0", // webpack先用css-loader加载器去解析后缀为css的文件，再使用style-loader生成一个内容为最终解析完的css代码的style标签，放到head标签里
    "eslint": "^4.15.0", // 代码格式检测插件
    "extract-text-webpack-plugin": "^3.0.0", // 将一个以上的包里面的文本提取到单独文件中
    "file-loader": "^1.1.4", // 打包压缩文件，与url-loader用法类似
    "friendly-errors-webpack-plugin": "^1.6.1", // 识别某些类别的WebPACK错误和清理，聚合和优先排序，以提供更好的开发经验
    "html-webpack-plugin": "^2.30.1", // 简化了HTML文件的创建，引入了外部资源，创建html的入口文件，可通过此项进行多页面的配置
    "jest": "^22.0.4", // JavaScript测试
    "nightwatch": "^0.9.12", // 自动化测试框架
    "node-notifier": "^5.1.2", // 支持使用node发送跨平台的本地通知
    "optimize-css-assets-webpack-plugin": "^3.2.0", // 压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    "ora": "^1.2.0", // 加载（loading）的插件
    "portfinder": "^1.0.13", // 查看进程端口
    "postcss-import": "^11.0.0", // 可以消耗本地文件、节点模块或web_modules
    "postcss-loader": "^2.0.8", // 用来兼容css的插件
    "postcss-url": "^7.2.1", // URL上重新定位、内联或复制
    "rimraf": "^2.6.0", // 节点的UNIX命令RM—RF,强制删除文件或者目录的命令
    "selenium-server": "^3.0.1", // Selenium的节点包装器
    "semver": "^5.3.0", // 用来对特定的版本号做判断的
    "shelljs": "^0.7.6", // 使用它来消除shell脚本在UNIX上的依赖性，同时仍然保留其熟悉和强大的命令，即可执行Unix系统命令
    "uglifyjs-webpack-plugin": "^1.1.1", // 压缩js文件
    "url-loader": "^0.5.8", // 压缩文件，可将图片转化为base64
    "vue-jest": "^1.0.2", // 具有源映射支持的Jest Vue变换器
    "vue-loader": "^13.3.0", // VUE单文件组件的WebPACK加载器
    "vue-style-loader": "^3.0.1", // 类似于样式加载程序，您可以在CSS加载器之后将其链接，以将CSS动态地注入到文档中作为样式标签
    "vue-template-compiler": "^2.5.2", // 这个包可以用来预编译VUE模板到渲染函数，以避免运行时编译开销和CSP限制
    "webpack": "^3.6.0", // webpack
    "webpack-bundle-analyzer": "^2.9.0", // 可视化webpack输出文件的大小
    "webpack-dev-server": "^2.9.1", // 提供一个提供实时重载的开发服务器
    "webpack-merge": "^4.1.0" // 它将数组和合并对象创建一个新对象。如果遇到函数，它将执行它们，通过算法运行结果，然后再次将返回的值封装在函数中
  },
  // engines是引擎，指定node和npm版本
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  // 限制了浏览器或者客户端需要什么版本才可运行
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```

devDependencies里面的插件只用于开发环境，不用于生产环境，即辅助作用，打包的时候需要，打包完成就不需要了。而dependencies是需要发布到生产环境的，自始至终都在。比如wepack等只是在开发中使用的包就写入到devDependencies，而像vue这种项目全程依赖的包要写入到dependencies

以图片为例，file-loader可对图片进行压缩，但是还是通过文件路径进行引入，当http请求增多时会降低页面性能，而url-loader通过设定limit参数，小于limit字节的图片会被转成base64的文件，大于limit字节的将进行图片压缩的操作。总而言之，url-loader是file-loader的上层封装。

## 2、根目录下其他文件

(1).postcssrc.js：.postcssrc.js文件其实是postcss-loader包的一个配置，在webpack的旧版本可以直接在webpack.config.js中配置，现版本中postcss的文档示例独立出.postcssrc.js，里面写进去需要使用到的插件

(2).babelrc：该文件是es6解析的一个配置

```javascript
{
  // 制定转码的规则
  "presets": [
    // env是使用babel-preset-env插件将js进行转码成es5，并且设置不转码的AMD,COMMONJS的模块文件，制定浏览器的兼容
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime"],
  "env": {
    "test": {
      "presets": ["env", "stage-2"],
      "plugins": ["transform-vue-jsx", "transform-es2015-modules-commonjs", "dynamic-import-node"]
    }
  }
}
```

(3).editorconfig：用editorconfig来实现多种编辑器的代码风格统一。

(4).eslintignore：Eslint会自动识别这个文件。这个配置文件里面，每一行都是一个glob模式语句

(5).eslintrc.js：eslintrc代码规则设置

(6).gitignore：告诉Git哪些文件不需要添加到版本管理中。

(7)package-lock.json：锁定安装时的包的版本号，并且需要上传到git，以保证其他人在npm install时大家的依赖能保证一致。

## 3、config文件夹

```
├─config 
│ ├─dev.env.js 
│ ├─index.js 
│ ├─prod.env.js 
│ ├─test.env.js 
```

这 `dev.env.js` `prod.env.js` `test.env.js` 三个文件都差不多，分别配置环境是开发、生产、测试。

```javascript
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// webpack-merge提供了一个合并函数，它将数组和合并对象创建一个新对象。
//如果遇到函数，它将执行它们，通过算法运行结果，然后再次将返回的值封装在函数中.这边将dev和prod进行合并
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
```

### config/index.js

```javascript
'use strict'
const path = require('path')

module.exports = {
  dev: {
    // 开发环境下面的配置
    assetsSubDirectory: 'static', // 子目录，一般存放css,js,image等文件
    assetsPublicPath: '/', // 根目录
    proxyTable: {}, // 可利用该属性解决跨域的问题
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false, // 是否在编译（输入命令行npm run dev）后打开http://localhost:8080/页面，以前配置为true，近些版本改为false
    errorOverlay: true, // 浏览器错误提示
    notifyOnErrors: true, // 跨平台错误提示
    poll: false, // 使用文件系统(file system)获取文件改动的通知devServer.watchOptions  https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map', // 增加调试，该属性为原始源代码（仅限行）不可在生产环境中使用

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true, // 使缓存失效
    cssSourceMap: true // 代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
  },

  build: {
    // 生产环境配置
    index: path.resolve(__dirname, '../dist/index.html'), // index编译后生成的位置和名字
    assetsRoot: path.resolve(__dirname, '../dist'), // 编译后存放生成环境代码的位置
    assetsSubDirectory: 'static', // js,css,images存放文件夹名
    assetsPublicPath: '/', // 发布的根目录，通常本地打包dist后打开文件会报错

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // unit的gzip命令用来压缩文件，gzip模式下需要压缩的文件的扩展名有js和css
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
```

## 4、build文件夹

```javascript
├─build 
│ ├─build.js 
│ ├─check-versions.js 
│ ├─utils.js 
│ ├─vue-loader.conf.js 
│ ├─webpack.base.conf.js 
│ ├─webpack.dev.conf.js 
│ ├─webpack.prod.conf.js 
```

### 1、build/build.js

```javascript
'use strict'
require('./check-versions')() // check-versions：调用检查版本的文件。

process.env.NODE_ENV = 'production'

const ora = require('ora') // 加载动画
const rm = require('rimraf') // 删除文件
const path = require('path') // 路径
const chalk = require('chalk') // 对文案输出的一个彩色设置
const webpack = require('webpack') // webpack
const config = require('../config') // 配置文件，默认读取下面的index.js文件
const webpackConfig = require('./webpack.prod.conf')
// 调用start的方法实现加载动画，优化用户体验
const spinner = ora('building for production...')
spinner.start()

// 先删除dist文件再生成新文件，因为有时候会使用hash来命名，删除整个文件可避免冗余
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
```

### 2、build/check-version.js

```javascript
'use strict'
const chalk = require('chalk')
const semver = require('semver') // 对版本进行检查
const packageConfig = require('../package.json')
const shell = require('shelljs')

function exec (cmd) {
  // 返回通过child_process模块的新建子进程，执行 Unix 系统命令后转成没有空格的字符串
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version), // 使用semver格式化版本
    versionRequirement: packageConfig.engines.node // 获取package.json中设置的node版本
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), // 自动调用npm --version命令，并且把参数返回给exec函数，从而获取纯净的版本号
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      // 上面这个判断就是如果版本号不符合package.json文件中指定的版本号，就执行下面错误提示的代码
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
```

### 3、build/utils.js

```javascript
'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
// 导出文件的位置，根据环境判断开发环境和生产环境，为config文件中index.js文件中定义的build.assetsSubDirectory或dev.assetsSubDirectory
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // 使用了css-loader和postcssLoader，通过options.usePostCSS属性来判断是否使用postcssLoader中压缩等方法
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap // 是否使用sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap // 否使用sourceMap,postcss-loader用来解决各浏览器的前缀问题
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(), // 需要css-loader 和 vue-style-loader
    postcss: generateLoaders(), // 需要css-loader和postcssLoader  和 vue-style-loader
    less: generateLoaders('less'), // 需要less-loader 和 vue-style-loader
    sass: generateLoaders('sass', { indentedSyntax: true }), // 需要sass-loader 和 vue-style-loader
    scss: generateLoaders('sass'), // 需要sass-loader 和 vue-style-loader
    stylus: generateLoaders('stylus'), // 需要stylus-loader 和 vue-style-loader
    styl: generateLoaders('stylus') // 需要stylus-loader 和 vue-style-loader
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0] // 每次捕获第一个错误
    const filename = error.file && error.file.split('!').pop() // 错误文件的名称所在位置

    notifier.notify({
      title: packageConfig.name, // 错误提示项目名字
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
// 引入node-notifier模块，这个模块是用来在桌面窗口提示信息，如果想要关闭直接return掉或者在webpack.dev.conf.js中关掉
```

### 4、build/vue-loader.conf.js

该文件的主要作用就是处理.vue文件，解析这个文件中的每个语言块（template、script、style),转换成js可用的js模块。

```javascript
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
// 处理项目中的css文件，生产环境和测试环境默认是打开sourceMap，而extract中的提取样式到单独文件只有在生产环境中才需要
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  // 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为require调用，以便目标资源可以由 webpack 处理.
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
```

### 5、build/webpack.base.conf.js

webpack.base.conf.js是开发和生产共同使用提出来的基础配置文件，主要实现配制入口，配置输出环境，配置模块resolve和插件等

```javascript
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  // 拼接出绝对路径
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  // 配置入口
  entry: {
    app: './src/main.js'
  },
  // 配置出口
  output: {
    path: config.build.assetsRoot,
    // 打包生成的出口文件所放的位置
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动的扩展后缀，比如一个js文件，则引用时书写可不要写.js
    extensions: ['.js', '.vue', '.json'],
    // 创建路径的别名，比如增加'components': resolve('src/components')等
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // 使用插件配置相应文件的处理方法
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      // 使用vue-loader将vue文件转化成js的模块
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // js文件需要通过babel-loader进行编译成es5文件以及压缩等操作
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      // 图片、音像、字体都使用url-loader进行处理，超过10000会编译成base64
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
    ]
  },
  // 以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
```

### 6、build/webpack.dev.conf.js

```javascript
'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 通过webpack-merge实现webpack.dev.conf.js对wepack.base.config.js的继承
const merge = require('webpack-merge')
const path = require('path')
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Friendly-errors-webpack-plugin可识别某些类型的webpack错误并清理，汇总和优先化它们以提供更好的开发者体验。
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查看空闲端口位置，默认情况下搜索8000这个端口
const portfinder = require('portfinder')

const HOST = process.env.HOST // processs为node的一个全局对象获取当前程序的环境变量，即host
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 规则是工具utils中处理出来的styleLoaders，生成了css，less,postcss等规则
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  
  // 此处的配置都是在config的index.js中设定好了
  devServer: {
    clientLogLevel: 'warning', // 控制台显示的选项有none, error, warning 或者 info
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true, // 热加载
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true, // 压缩
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser, // 调试时自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false, // warning 和 error 都要显示
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, // 接口代理
    quiet: true, // 控制台是否禁止打印警告和错误,若用FriendlyErrorsPlugin 此处为 true
    watchOptions: {
      poll: config.dev.poll, // 文件系统检测改动
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(), // 模块热替换插件，修改模块时不需要刷新页面
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(), // 当webpack编译错误的时候，来中端打包进程，防止错误代码打包到文件中
    // https://github.com/ampedandwired/html-webpack-plugin
    // 该插件可自动生成一个 html5 文件或使用模板文件将编译好的代码注入进去
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*'] // 忽略.*的文件
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  // 查找端口号
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 端口被占用时就重新设置evn和devServer的端口
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
```

### 7、build/webpack.prod.conf.js

```javascript
'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap, // 开启调试的模式。默认为true
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: { // 压缩
          warnings: false // 警告：true保留警告，false不保留
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({ // 抽取文本。比如打包之后的index页面有style插入，就是这个插件抽取出来的，减少请求
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({ // 优化css的插件
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({ // html打包
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: { // 压缩
        removeComments: true, // 删除注释
        collapseWhitespace: true, // 删除空格
        removeAttributeQuotes: true // 删除属性的引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency' // 模块排序，按照我们需要的顺序排序
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({ // 抽取公共的模块
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    new CopyWebpackPlugin([ // 复制，比如打包完之后需要把打包的文件复制到dist里面
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```

参考自：[vue-cli脚手架中webpack配置基础文件详解](https://segmentfault.com/a/1190000014804826)

# 三、运行、编译打包Vue应用

通常我们用 `node` 运行一个 `test.js` 文件会使用 `node test.js`，但是在 `npm init` 后就可以使用 `package.json` 进行配置了。 如：在 `"scripts"` 中配置 `"test": "test.js"` ，那么，就可以使用 `npm run test` 运行这个文件了。

同理，我们运行 `npm run dev` 就是运行 `webpack-dev-server --inline --progress --config build/webpack.dev.conf.js` 。

其中， `--inline` 为入口页面添加“热加载”功能，即代码改变后重新加载页面(顺便一提： `--hot` 即模块热替换，在前端代码变动的时候无需整个刷新页面，只把变化的部分替换掉)， `--progress` 为将运行进度输出到控制台， `--config` 是修改默认 `webpack.config.js` 配置文件为 `build/webpack.dev.conf.js` 。

进入 `build/webpack.dev.conf.js` 是一些开发环境的配置，在上文，我们已经做了注释。 `webpack-merge` 提供了一个合并函数，用于连接数组、合并创建新的对象。如果遇到函数，它将执行它们，通过算法运行结果，然后再次将返回的值包装在函数中。 `baseWebpackConfig` 中包含一些开发、生产环境通用的配置。 `module.exports = new Promise()` 执行函数。

再来看看打包过程， `npm run build` 运行 `node build/build.js` 。首先通过 `rm` 删除 `dist` 文件夹，然后使用 `webpack.prod.conf.js` 中的配置打包生产环境。

## 一些插件的解析

### 1、DefinePlugin

[DefinePlugin中文文档](https://webpack.docschina.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx)

允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。

### 2、CommonsChunkPlugin

[CommonsChunkPlugin中文文档](https://webpack.docschina.org/plugins/commons-chunk-plugin/)

`new webpack.optimize.CommonsChunkPlugin(options);` 通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来页面速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。 `The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。想要了解在最新版本中如何处理 chunk，请查看 SplitChunksPlugin`

```javascript
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) => boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。

  children: boolean,
  // 如果设置为 `true`，所有公共 chunk 的子模块都会被选择

  deepChildren: boolean,
  // 如果设置为 `true`，所有公共 chunk 的后代模块都会被选择

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```

### 3、UglifyJsPlugin

[UglifyJsPlugin中文文档](https://webpack.docschina.org/migrate/3/#uglifyjsplugin-warnings)

代码压缩

# 创建一个简易的.vue文件打包项目

### 1、创建

` npm init -y` 生成 `package.json` ，创建文件。

安装插件：

```javascript
npm install webpack -D // 注意，我选的版本是3.6.0，和webpack4配置有点不同
```

项目结构：

```
├─build 
│ ├─webpack.build.js
├─dist
├─node_modules
├─src
│ ├─assets
| | ├─logo.png
│ ├─main.js
├─index.html
└─package.json
```

给 `package.json` 中 `"scripts"` 添加 `build` 代码：

```javascript
"scripts": {
    "build": "node build/webpack.build.js"
}
```

给 `src/main.js` 添加代码：

```javascript
console.log('main.js');
```

给 `build/webpack.build.js` 添加代码：

```javascript
const path = require('path');
const webpack = require('webpack');

let config = {
    entry: path.resolve(__dirname, '../src/main.js'), // 这里要绝对路径
    output: {
        path: path.resolve(__dirname, '../dist'), // 生成到根目录下dist文件夹
        filename: '[name].js'
    }
};

webpack(config, (err, stats) => {
    if(err || stats.hasErrors()) {
        // 在这里处理错误
    }

    // 处理完成
});
```

运行 `npm run build` ，可以看到生成了 `dist` 文件夹了！

此时，我们仅仅是打包了 `js` 文件，要包含 `html` 文件还需要下载插件：

```javascript
npm install html-webpack-plugin -D
```

`webpack.build.js` 增加配置：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html', // 模板为根目录下index.html
            filename: 'a.html', // 生成的html
        })
    ]
};
```

这样，就创建了一个包含 `js` 的 `html` 文件。再加入包含 `.vue` 文件。

创建 `src/App.vue` 文件：

```javascript
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h6>test</h6>
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

修改 `src/main.js` 文件：

```javascript

console.log('main.js');

import Vue from 'vue'
import App from './App.vue' // 注意要加 .vue 即：App.vue ，暂时还没装检测文件插件
// import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
//   router,
  components: { App },
  template: '<App/>'
})
```

安装插件 `Vue` :

```javascript
npm install vue -D
```

`.vue` 文件暂时无法识别，需要配置 `webpack` `.vue` 插件：

```javascript
npm install vue-loader -D
npm install vue-template-compiler -D
```

`index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

`src/App.vue` 中有 `<style>` 标签，需要安装 `css` 插件，我们先不装，把项目运行起来，修改文件：

```javascript
<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <h6>test</h6>
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

此时， `build/webpack.build.js` 修改如下：

```javascript
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let config = {
    // ... 省略代码
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/ // 不包含 node_modules 文件夹下 .vue 文件
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html', // 模板为根目录下index.html
            filename: 'a.html', // 生成的html
        }),
        new VueLoaderPlugin()
    ],
    // Issues: https://github.com/vuejs-templates/webpack/issues/215
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};
```

给 `src/App.vue` 配置 `<style>` 标签。安装插件：

```javascript
npm install style-loader css-loader -D
```

添加打包图片的插件：

```javascript
npm install url-loader -D
npm install file-loader -D
```

 `build/webpack.build.js` 修改如下：

```javascript
let config = {
    // ... 省略代码
    module: {
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: "url-loader",
                    options: {
                        limit: 1000 // 小于1kb打包成base64
                    }
                }
            ]
        }
    }
};
```

添加热更新功能：

```javascript
npm install webpack-dev-server -D
// 注意，我这里webpack的版本是3，webpack-dev-server的版本必须是2.
```

创建 `build/webpack.dev.js` 

```javascript
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
    }
};

module.exports = config;
```

`package.json` 增加一条：

```javascript
"scripts": {
    "dev": "webpack-dev-server --config  build/webpack.dev.js"
}
```

打开浏览器： `http://localhost:3000/` 。

首页地址在： `http://localhost:3000/index.html` 可以在 `build/webpack.dev.js` 中配置：

```javascript
plugins: [
    new HtmlWebpackPlugin({
        template: 'index.html', // 模板为根目录下index.html
        filename: 'index.html', // 生成的html
    }),
]
```

[github实例代码](https://github.com/jarvis12138/blog/tree/master/webpack/vue-webpack)

终于写完了。。。