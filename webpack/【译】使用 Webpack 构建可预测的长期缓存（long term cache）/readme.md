# 【译】使用 Webpack 构建可预测的长期缓存（long term cache）

**原文地址：** [https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)

首先，是什么阻止了默认的未经优化的 Webpack 构建包长期缓存？说来话长，让我们一起来看看。

我们将使用 Webpack 建立一个小应用程序，让它随着时间的推移而增长，从而遇到各种各样的问题，并解决它们。

## 基础配置

这是我们最初的未经优化的 Webpack 配置：

```js
// webpack.config.js 
const path = require('path'); 
const webpack = require('webpack'); 
module.exports = { 
    entry: { 
        main: './src/foo', 
    }, 
    output: { 
        path: path.join(__dirname, 'dist'), 
        filename: '[name].[hash].js' 
    }
};
```

这是 foo.js：

```js
// foo.js 
import preact from 'preact'; 
console.log(preact.toString());
```

打包之后，Webpack 输出如下：

```
                Asset          Size    Chunks        Chunk Names
main.db3022283e4b37cce06b.js  23.6 kB    0  [emitted]  main
   [0] ./~/preact/dist/preact.js 20.5 kB {0} [built]
   [1] ./src/foo.js 61 bytes {0} [built]
```

看起来好像还好。

## Vendor chunks

我们能想到的第一个优化可能是从我们的主入口文件中提取出 preact，因为在我们的应用中，它几乎不会更改，因此我们将 CommonsChunkPlugin 添加到我们的 Webpack 配置中：

```js
// webpack.config.js 
// ... 
plugins: [ 
    new webpack.optimize.CommonsChunkPlugin({ 
        name: ['vendor'] 
    }) 
] 
// ...
```

再次打包，我们得到了如下的输出：

```
                         Asset       Size  Chunks             Chunk Names
  main.423221edd7eef26d646e.js  506 bytes       0  [emitted]  main
vendor.423221edd7eef26d646e.js    26.7 kB       1  [emitted]  vendor
   [0] ./~/preact/dist/preact.js 20.5 kB {1} [built]
   [1] ./src/foo.js 61 bytes {0} [built]
   [2] multi preact 28 bytes {1} [built]
```

不要走开，精彩马上开始。

## 正确的 hash

你可能已经注意到了，我们在这里遇到了第一个问题。我们的 main 模块 和 vendor 模块的 hash 是相同的。对 main 模块的任何更改同时也会导致我们的 vendor 模块的 hash 失效。

要解决这个问题，我们必须在文件名中把 hash 改成 chunkhash。这是因为 hash 会为我们构建的所有内容生成一个全局哈希，而 chunkhash 只会哈希它自己的模块中的内容。

```js
// webpack.config.js 
// ... 
output: { 
  path: path.join(__dirname, 'dist'), 
  filename: '[name].[chunkhash].js', 
}, 
// ...
```

再次运行我们的构建，我们现在看到两个不同的哈希值：

```
                         Asset       Size  Chunks             Chunk Names
  main.edc22f71759cbe5336ae.js  528 bytes       0  [emitted]  main
vendor.27f1230219fd2a606a54.js    26.7 kB       1  [emitted]  vendor
   [0] ./~/preact/dist/preact.js 20.5 kB {1} [built]
   [1] ./src/foo.js 83 bytes {0} [built]
   [2] multi preact 28 bytes {1} [built]
```

## 运行时问题

理论上，更改 main 模块中的任何内容现在应该保证 vendor 模块不受影响。

我们来添加一行代码测试一下：

```js
// foo.js
// ...
console.log(preact.toString());
console.log("hello world");
```

打包之后，GG

```js
                Asset       Size  Chunks             Chunk Names
  main.91022729b32987083f0d.js  506 bytes       0  [emitted]  main
vendor.0da51f051fcf235d7027.js    26.7 kB       1  [emitted]  vendor
   [0] ./~/preact/dist/preact.js 20.5 kB {1} [built]
   [1] ./src/foo.js 61 bytes {0} [built]
   [2] multi preact 28 bytes {1} [built]
```

这是为什么呢？问题出在这里：

当 Webpack 从 main 模块中提取 preact 时，也会将 Webpack 的运行时提取到其中。运行时是 Webpack 的一部分，它在运行时解析模块并处理异步加载等。深入它之后，我们看到了对 main 模块的引用：

```js
// rawvendor-chunk.js 
// somewhere in the vendor.0da51f051fcf235d7027.js
// ...
chunkId + "." + {"0":"91022729b32987083f0d"}[chunkId]
// ...
```

幸运的是我们可以解决这个问题。如果添加一个 CommonsChunkPlugin ，其名称不存在，因为入口点Webpack的名称将提取运行时，请按该名称创建一个块并将运行时放在那里。是不是听起来就像是魔法？

```js
// extracted-runtime.webpack.config.js 
// webpack.config.js 
// ... 
plugins: [ 
  // ... 
  new webpack.optimize.CommonsChunkPlugin({ 
    name: ['runtime'] 
  }) 
]
```

挥起我们的法杖，再次构建，得到了这样的结果：

```
                          Asset       Size  Chunks             Chunk Names
 vendor.634878b098e5c599febd.js    20.7 kB       0  [emitted]  vendor
   main.d59c6ff3126e3943c563.js  538 bytes       1  [emitted]  main
runtime.25ce0c546aab71f8eac5.js    5.92 kB       2  [emitted]  runtime
   [0] ./~/preact/dist/preact.js 20.5 kB {0} [built]
   [1] ./src/foo.js 93 bytes {1} [built]
   [2] multi preact 28 bytes {0} [built]
```

现在改变 main 块中的内容只会改变 runtime 和 main 块了，vendor 块将保持不变。

## 添加更多的依赖

然而，故事并没有结束。随着我们项目的增长，我们增加了更多的依赖：

```js
// foo.js
import bar from './bar';
// ...
```

我们再次构建一次，在这次构建中，我们只希望 main 块和 vendor 块能够改变。但是正如你所想的，它不会遂我们的意：

```
                       Asset       Size  Chunks             Chunk Names
   main.cec87b856171489c2719.js  811 bytes       0  [emitted]  main
 vendor.73db375ed475c718163f.js    20.7 kB       1  [emitted]  vendor
runtime.93b41beba42ebff23af0.js    5.92 kB       2  [emitted]  runtime
   [0] ./~/preact/dist/preact.js 20.5 kB {1} [built]
   [1] ./src/bar.js 23 bytes {0} [built]
   [2] ./src/foo.js 118 bytes {0} [built]
   [3] multi preact 28 bytes {1} [built]
```

尽管我们的 vendor 块没有任何变化，它的 hash 还是又一次改变了。原因又是一个 webpack 中的细节：webpack 会为每个 chunk 按顺序给出一个依次增加的 chunk id，由于 chunk 顺序会随着每个新导入的增加而改变，chunk id 也会随之更新。

## 命名你的模块（chunk）

使用 NamedChunksPlugin 可以给模块命名，这是在 Webpack 2.4 版本中加入的一项特性，借助它我们可以让模块有自己的名字，而不是冷冰冰的数字。

```js
// named-chunks.webpack.config.js
// weback.config.js 
// ... 
plugins: [ 
  new webpack.NamedChunksPlugin(), 
  // ... 
// ...
```

这样配置，Webpack 将使用唯一的 chunk 名称而不是其 id 来标识一个 chunk。

我们在添加和不添加 bar.js 的情况下分别再构建一次，应该就可以看到，vendor 块的哈希是保持不变的了。 好吧，结果并没有。 检查一下这两个 vendor 块，我们可以看到出现了这样的情况：

```
// difference-in-output.js

// old vendor build
// ...
/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {
// ...


// vendor build with new import
// ...
/***/ }),
/* 1 */,
/* 2 */
/* 3 */
/***/ (function(module, exports, __webpack_require__) {
// ...
```

## 为你的模块（module）命名 - 抱歉这里不是双关:(

出于某种原因，Webpack 为我们的 vendor 块中的所有 modules 添加了这些 id。我们不需要太在意这个，幸运的是有一个简单的解决方案，我们加入这个插件：NamedModulesPlugin


```js
// named-modules.webpack.config.js
// webpack.config.js 
// ... 
plugins: [ 
  new webpack.NamedModulesPlugin(), 
  // ... 
// ...
```

It does very much the same as the named chunk equivalent. Instead of using numerical ids it uses a unique path to map our request to a module.

Thanks to this change the vendor hash will now always stay the same:

它和 NamedChunksPlugin 非常相似，它不使用数字 id，而是使用唯一路径将我们的请求映射到模块。这样操作之后，我们可以看到 vendor 的哈希现在将保持不变了：

```
// output without bar.js
                          Asset       Size   Chunks             Chunk Names
   main.5f15e6808c8037c8bdbc.js  628 bytes     main  [emitted]  main
runtime.72ef2fc7d9df236c7f1c.js    5.94 kB  runtime  [emitted]  runtime
 vendor.73c86187abcdf9fd7b18.js    20.7 kB   vendor  [emitted]  vendor
[./node_modules/preact/dist/preact.js] ./~/preact/dist/preact.js 20.5 kB {vendor} [built]
   [0] multi preact 28 bytes {vendor} [built]
[./src/foo.js] ./src/foo.js 121 bytes {main} [built]


// output with bar.js
                          Asset       Size   Chunks             Chunk Names
   main.47b747115cd1c2c24b93.js  901 bytes     main  [emitted]  main
runtime.8d94ab27ee79b53aa9a2.js    5.94 kB  runtime  [emitted]  runtime
 vendor.73c86187abcdf9fd7b18.js    20.7 kB   vendor  [emitted]  vendor
[./node_modules/preact/dist/preact.js] ./~/preact/dist/preact.js 20.5 kB {vendor} [built]
[./src/bar.js] ./src/bar.js 23 bytes {main} [built]
   [0] multi preact 28 bytes {vendor} [built]
[./src/foo.js] ./src/foo.js 118 bytes {main} [built]
```
