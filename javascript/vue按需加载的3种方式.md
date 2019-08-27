
# vue按需加载的3种方式

### 1、vue异步组件技术

我们增加3个组件,分别是 `A.vue` , `B.vue` , `C.vue`

```html
//A.vue
<template>
    <h1>这里是A.vue组件</h1>
</template>

//B.vue
<template>
    <h1>这里是B.vue组件</h1>
</template>

//C.vue
<template>
    <h1>这里是C.vue组件</h1>
</template>
```

在路由中进行配置

```js
//app.js

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//AMD规范的异步载入
const ComA = resolve => require(['./components/A.vue' ], resolve);
const ComB = resolve => require(['./components/B.vue' ], resolve);
const ComC = resolve => require(['./components/C.vue' ], resolve);

const router = new VueRouter({
  routes: [
    {
      name: 'component-A',
      path: '/a',
      component: ComA
    },
    {
      name: 'component-B',
      path: '/b',
      component: ComB
    },
    {
      name: 'component-C',
      path: '/c',
      component: ComC
    }
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
```

在 `webpack.config.js` 中进行配置 `output.chunkFilename`

```js
//webpack.config.js

output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js',
    //添加chundkFilename
    chunkFilename: '[name].[chunkhash:5].chunk.js'
}
```

执行 `npm run build` ,此时 `dist` 目录下多出的3个文件,就是对应的 `A.vue` , `B.vue` , `C.vue`

```
0.eea4e.chunk.js
1.cc132.chunk.js
2.6b6a8.chunk.js
```

### 2、webpack提供的require.ensure()

刚才在路由引入的时候, 使用的是AMD规范的异步载入. webpack提供了require.ensure()这个方法实现CMD规范的异步载入.

下面的代码是使用 `require.ensure()` 方法对路由进行配置

```js
//app.js

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//AMD风格的异步加载
// const ComA = resolve => require(['./components/A.vue' ], resolve);
// const ComB = resolve => require(['./components/B.vue' ], resolve);
// const ComC = resolve => require(['./components/C.vue' ], resolve);

//CMD风格的异步加载
const ComA = resolve => require.ensure([], () => resolve(require('./components/A.vue')), 'A');
const ComB = resolve => require.ensure([], () => resolve(require('./components/B.vue')), 'B');
const ComC = resolve => require.ensure([], () => resolve(require('./components/C.vue')), 'C');

const router = new VueRouter({
  routes: [
    {
      name: 'component-A',
      path: '/a',
      component: ComA
    },
    {
      name: 'component-B',
      path: '/b',
      component: ComB
    },
    {
      name: 'component-C',
      path: '/c',
      component: ComC
    }
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
```

执行 `npm run build` ,此时 `dist` 目录下同样多出的3个文件,就是对应的 `A.vue` , `B.vue` , `C.vue`

```
0.eea4e.chunk.js
1.cc132.chunk.js
2.6b6a8.chunk.js
```

### 3、es提案的import()

推荐使用这种方式(需要webpack > 2.4)

webpack官方文档：webpack中使用import() vue官方文档：路由懒加载使用import()

vue-router配置路由，代码如下：

```js
// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
const ImportFuncDemo1 = () => import('../components/ImportFuncDemo1')
const ImportFuncDemo2 = () => import('../components/ImportFuncDemo2')
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
// const ImportFuncDemo = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo')
// const ImportFuncDemo2 = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo2')
export default new Router({
    routes: [
        {
            path: '/importfuncdemo1',
            name: 'ImportFuncDemo1',
            component: ImportFuncDemo1
        },
        {
            path: '/importfuncdemo2',
            name: 'ImportFuncDemo2',
            component: ImportFuncDemo2
        }
    ]
})
```
