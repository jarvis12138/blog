
call

call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

举例：

```javascript
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

1、call 改变了 this 的指向，指向到 foo

2、bar 函数执行了

### 模拟实现

首先，我们想到

```javascript
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value);
    }
};

foo.bar(); // 1
```

这时 this 指向 foo 

```javascript
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

注意，现在我们还不能传入参数

```javascript
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}

var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name);
    console.log(age);
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

还有，this 参数可以传 null，当为 null 的时候，视为指向 window。函数是可以有返回值的。

```javascript
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn;
    return result;
}

var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
```

### apply的模拟实现

```javascript
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }

    delete context.fn;
    return result;
}
```
