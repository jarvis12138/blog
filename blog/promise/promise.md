
# Promise

> Promise 对象用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值。 -- 来自MDN

# Promise 用法

```js
new Promise(
    // 执行器 executor
    function (resolve, reject) {
        // 异步操作

        resolve(); // 数据处理完成
        reject(); // 数据处理出错
    }
)
.then(function A() {
    // 成功，下一步
}, function B() {
    // 失败，做相应处理
});
```

### 简单实例

```js
console.log('here we go');
new Promise(function (resolve) {
    setTimeout(function () {
        resolve('hello');
    }, 2000);
})
.then(function (value) {
    console.log(value + ' world');
});
```

```js
console.log('here we go');
new Promise(function (resolve) {
    setTimeout(function () {
        resolve('hello');
    }, 2000);
})
.then(function (value) {
    console.log(value + ' world');
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('world');
        }, 2000);
    });
})
.then(function (value) {
    console.log(value + ' world');
});
```

```js
console.log('here we go');
var promises = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('the promise fulfilled');
        resolve('hello');
    }, 1000);
});

setTimeout(function () {
    promises.then(function (value) {
        console.log(value + ' world'); // 2秒后执行
    });
}, 3000);
```

假如在 .then() 函数不返回新的 Promise 

```js
console.log('here we go');
new Promise(function (resolve) {
    setTimeout(function () {
        resolve('hello');
    }, 2000);
})
.then(function (value) {
    console.log(value + ' world');
    (function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log('six');
                resolve('world');
            }, 2000);
        });
    }());
    // return false;
})
.then(function (value) {
    console.log(value + ' world'); // 如果没有 return ,则 value 为 undefined 
});
```

在 .then() 函数中嵌套 .then()

```js
// ...省略
```

[We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)

```js
doSomething().then(function () {
    return doSomethingElse();
}).then(function finalHandler(res) {
    console.log(res);
});
doSomething().then(function () {
    doSomethingElse();
}).then(function finalHandler(res) {
    console.log(res);
});
doSomething().then(doSomethingElse()).then(function finalHandler(res) {
    console.log(res);
});
doSomething().then(doSomethingElse).then(function finalHandler(res) {
    console.log(res);
});

function doSomething() {
    return new Pormise((resolve, reject) => {
        setTimeout(() => {
            resolve('something');
        }, 1000);
    });
}

function doSomethingElse() {
    return new Pormise((resolve, reject) => {
        setTimeout(() => {
            resolve('somethingElse');
        }, 1500);
    });
}
```

```js
// 第一种情况：
doSomething()
|----------|
           doSomethingElse()
           |---------------|
                           finalHandler(somethingElse)
                           |->

// 第二种情况：
// 因为没有使用 return，doSomethingElse 在 doSomething 执行完后异步执行的。
doSomething()
|----------|
           doSomethingElse()
           |---------------|
           finalHandler(undefined)
           |->

// 第三种情况：
// then 需要接受一个函数，否则会值穿透，所以打印 something。
doSomething()
|----------|
doSomethingElse()
|---------------|
           finalHandler(something)
           |->

// 第四种情况:
// doSomethingElse 作为 then 参数传入不会发生值穿透，并返回一个 promise，所以会顺序执行。
doSomething()
|----------|
           doSomethingElse(something)
           |---------------|
                           finalHandler(somethingElse)
                           |->

```

错误处理

```js
console.log('here we go');
new Promise(function (resolve) {
    setTimeout(function () {
        throw new Error('bye');
    }, 2000);
})
.then(function (value) {
    console.log(value + ' world');
})
.catch(function (error) {
    console.log(error + ' world');
});
```

catch 和 then 函数连用

```js
console.log('here we go');
new Promise(function (resolve) {
    setTimeout(function () {
        resolve('hello');
        // throw new Error('bye');
    }, 2000);
})
.then(function (value) {
    console.log(value + ' world');
    throw new Error('bye');
})
.catch(function (error) {
    console.log(error + ' world');
})
.then(function (value) {
    console.log(value + ' world');
})
.then(function (value) {
    console.log(value + ' world');
    throw new Error('bye');
})
.catch(function (error) {
    console.log(error + ' world');
});
```

Promise.all(iterable) 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。

```js
console.log('here we go');
Promise.all([1,2,3])
.then(function (value) {
    console.log('1: ', value);
    return Promise.all([function () {
        console.log('00');
    }, '0011', false]);
})
.then(function (value) {
    console.log('2: ', value);
});
```

Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝(即任意一个完成就算完成)。

```js
// ...省略
```

# Promise 实现

[Promise 实现](https://github.com/xieranmaya/blog/issues/3)

[Promise 实现](https://zhuanlan.zhihu.com/p/21834559)

