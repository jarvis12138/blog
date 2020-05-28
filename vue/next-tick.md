# `nextTick` 原理及源码解析

 `nextTick` 是 `Vue` 的核心功能之一，接下来就让我们看看 `nextTick` 是什么。

### `nextTick` 使用场景

> 官方解释：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

通俗点讲，可能的常用场景有，比如有个 `dialog` 弹窗。

```html
<dialog ref="box" v-if="show"></dialog>
<button @click="show=true">show</button>
```

点击按钮让 `show` 的值为 `true` ，这时数据更新了但 `this.$refs.box` 其实并不能获取到DOM元素。

此时，就需要使用

```js
this.$nextTick(()=>{
  console.log(this.$refs.box)
})
```

### JS运行机制

在分析 `nextTick` 源码前，先了解下JS运行机制。

JS是单线程（同步）的，基于事件循环机制。大致分为以下几个步骤：

1、所有同步任务都在主线程上执行，形成一个执行栈（ `execution context stack` ）。

2、主线程之外还存在一个任务队列（ `task queue` ）。只要异步任务有了运行结果，就在任务队列之中放置一个事件。

3、一旦执行栈中的所有同步任务都执行完毕，系统就会读取任务队列，看看里面有哪些事件。一个个进入执行栈开始执行。

4、主线程不断重复上面三步。

主线程的执行过程就是一个 `tick` ，而所有的异步结果都是通过任务队列来调度。消息队列中存放的是一个个任务（ `task` ）。规范中规定的 `task` 分为两大类，分别是 `macro task` 和 `micro task` ，并且每个 `macro task` 结束后都要清空里面的 `micro task` 。

执行逻辑大致为

```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```

不管执行宏任务还是微任务，完成后都会进入下一个 `tick` ，并在两个 `tick` 之间执行UI渲染。

但是，宏任务耗费的时间是大于微任务的，所以在浏览器支持的情况下，优先使用微任务。如果浏览器不支持微任务，使用宏任务；但是，各种宏任务之间也有效率的不同，需要根据浏览器的支持情况，使用不同的宏任务。

在浏览器环境中，常见的 `macro task` 有 `setTimeout` 、 `MessageChannel` 、 `postMessage` 、 `setImmediate` 

常见的 `micro task` 有 `MutationObserver` 和 `Promise.then` 。

### 简易版本

实现一个简易版本

```js
let callbacks = [];
let pending = false;

function nextTick (cb) {
  callbacks.push(cb);

  if (!pending) {
    pending = true;
    console.log(cb);
    setTimeout(flushCallbacks, 0);
    console.log('cb');
  }
}

function flushCallbacks () {
  pending = false;
  let copies = callbacks.slice();
  callbacks.length = 0;
  copies.forEach(copy => {
    copy();
  });
}

// 测试
function a() { console.log('a') }
function b() { console.log('b') }
function c() { console.log('c') }
nextTick(a); // 函数执行到 pending = true; 这时宏任务 setTimeout(flushCallback, 0); 中的 flushCallback 执行被越过继续向下执行
nextTick(b); // pending 为 true 了， nextTick 函数就只会执行 push (b、c) 函数了
nextTick(c);
```

### 源码解析

```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  // 防止出现 nextTick 中包含 nextTick 时出现问题，在执行回调函数队列前，提前复制备份，清空回调函数队列
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

// 优先使用 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)

    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 是否支持 MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 能力检测，测试浏览器是否支持原生的setImmediate（setImmediate只在IE中有效）
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 所有的都不支持 则使用 setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    // 有 cb 函数时执行 cb 函数，没有时执行 _resolve
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      // 执行 _resolve 的情况有，如： nextTick().then(() => {})
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // 当 nextTick 不传 cb 参数时提供一个 Promise 化的调用，如: nextTick().then(() => {}) 。当 _resolve 函数执行，就会跳到 then 的逻辑中。
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

### 小测验

```js
var vm = new Vue({
  el: '#app',
  data() {
    return {
      msg: 'hello'
    }
  },
  mounted() {
    this.msg = 'world'
    console.log('start')
    setTimeout(() => {
      console.log('setTimeout')
    }, 0)
    Promise.resolve().then(() => {
      console.log('Promise')
    })
    this.$nextTick(() => {
      console.log('nextTick')
    })
  }
})
```

1、因为 `this.msg` 的修改触发了 `Watcher` 的 `update` ，从而将更新操作push进Vue的事件队列。

2、 `this.$nextTick` 也为事件队列push进了一个新的callback函数。使用谷歌最新浏览器测试，支持 `Promise` ，调用微任务。（所以打印 `Promise` 后打印 `nextTick` ， `setTimeout` 是宏任务最后打印）

3、在不兼容 `Promise` 的IE中引入 `polyfill` 后， `vue2.3.0` 版本打印： `start nextTick setTimeout Promise` （ `vue2.4` 之前版本会优先执行 `Promise` ）； `vue2.6.11` 版本打印： `start setTimeout Promise nextTick` 。
