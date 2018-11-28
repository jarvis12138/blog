
### JSON.parse

[JSON.parse](https://www.ecma-international.org/ecma-262/6.0/#sec-json.parse)

![parse](https://github.com/jarvis12138/blog/blob/master/question/image/JSON.parse.png?raw=true)

### JSON.stringify

[JSON.stringify](https://www.ecma-international.org/ecma-262/6.0/#sec-json.stringify)

![stringify](https://github.com/jarvis12138/blog/blob/master/question/image/JSON.stringify.png?raw=true)

### json2.js源码解析

<b>JSON.parse的实现</b>

对于JSON.parse，作者并没有进行特殊的处理，仅仅是判断该字符串是否符合json格式，不符合抛出异常：`throw new SyntaxError('JSON.parse')` ；符合则通过 `eval('(' + text + ')')` 函数直接输出json格式。

```javascript
if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    j = eval('(' + text + ')');
}
```

有三个正则匹配：

```javascript

```

![parse](https://github.com/jarvis12138/blog/blob/master/question/image/regexp1.png?raw=true)

![parse](https://github.com/jarvis12138/blog/blob/master/question/image/regexp2.png?raw=true)

![parse](https://github.com/jarvis12138/blog/blob/master/question/image/regexp3.png?raw=true)

### 函数柯里化

```javascript
function add () {
    var args = Array.prototype.slice.call(arguments);

    var fn = function () {
        var arg_fn = Array.prototype.slice.call(arguments);
        return add.apply(null, args.concat(arg_fn));
    };

    fn.valueOf = function () {
        return args.reduce(function (a, b) {
            return a + b;
        });
    };

    return fn;
}

add(1,2,3);   // 6
```