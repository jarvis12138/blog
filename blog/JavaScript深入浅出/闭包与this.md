
### 闭包

要理解闭包，首先必须理解Javascript特殊的变量作用域。

变量的作用域无非就是两种：全局变量和局部变量。

Javascript语言的特殊之处，就在于函数内部可以直接读取全局变量。

另一方面，在函数外部自然无法读取函数内的局部变量。

这里有一个地方需要注意，函数内部声明变量的时候，一定要使用var命令。如果不用的话，你实际上声明了一个全局变量！

出于种种原因，我们有时候需要得到函数内的局部变量。但是，前面已经说过了，正常情况下，这是办不到的，只有通过变通方法才能实现。

那就是在函数的内部，再定义一个函数。

各种专业文献上的"闭包"（closure）定义非常抽象，很难看懂。我的理解是，闭包就是能够读取其他函数内部变量的函数。

由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。

所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

> 摘自： 阮一峰 学习Javascript闭包（Closure） http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html

### 有关 this 的一道题

在闭包中使用 this 对象也可能会导致一些问题。我们知道，this 对象是在运行时基于函数的执行环境绑定的：在全局函数中，this 等于 window，而当函数被作为某个对象的方法调用时，this 等于那个对象。不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。但有时候由于编写闭包的方式不同，这一点可能不会那么明显。

1、基于函数的执行环境：

```javascript
function foo() {
    console.log(this);
}

console.log(this); // window
```

2、基于某个对象的方法调用：

```javascript
document.body.onclick = function() {
    console.log(this); // body
}
```

```javascript
var obj = {
    get: function() {
        console.log(this);
    }
};

console.log(obj.get()); // obj
```

```javascript
function foo() {
    console.log(this);
}

new foo(); // foo
```

**例题：**

```javascript
var name = "The Window";

var object = {
    name: "My Object",
    getName: function () {
        return function () {
            return this.name;
        };
    }
};

console.log(object.getName()()); // "The Window" (非严格模式下)
```

以上代码先创建了一个全局变量 name，又创建了一个包含 name 属性的对象。这个对象还包含一个方法——getName()，它返回一个匿名函数，而匿名函数又返回 this.name。由于 getName()返回一个函数，因此调用 object.getName()()就会立即调用它返回的函数，结果就是返回一个字符串。然而，这个例子返回的字符串是"The Window"，即全局 name 变量的值。为什么匿名函数没有取得其包含作用域（或外部作用域）的 this 对象呢？

每个函数在被调用时都会自动取得两个特殊变量：this 和 arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。不过，把外部作用域中的 this 对象保存在一个闭包能够访问到的变量里，就可以让闭包访问该对象了，如下所示。

```javascript
var name = "The Window";

var object = {
    name: "My Object",
    getName: function () {
        var that = this;
        return function () {
            return that.name;
        };
    }
};

console.log(object.getName()()); // "My Object"
```

在定义匿名函数之前，我们把 this对象赋值给了一个名叫 that 的变量。而在定义了闭包之后，闭包也可以访问这个变量，因为它是我们在包含函数中特意声名的一个变量。即使在函数返回之后，that 也仍然引用着 object，所以调用object.getName()()就返回了"My Object"。



> 参考： 《JavaScript高级程序设计》
