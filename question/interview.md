
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

### rem适配方案

```javascript
// 1 
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

// 2 
(function (win,doc){
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        html,
        htmlW,
        fontSize,
        rem,
        recalc = function(){
            html = doc.documentElement
            htmlW = html.clientWidth < 750 ? html.clientWidth : 750 //最大 1rem = 100px;
            fontSize = htmlW / 7.5  // 默认按照 IPhone 6 ,1rem = 50px;
            rem = doc.getElementById('rem') || null
            if (rem) {
                rem.parentNode.removeChild(rem)
            }
            /* 创建style标签并添加到Head标签里去 */
            if(doc.all){
                // IE写法
                win.style="html{font-size:" + fontSize + "px;}";
                win.style.id ='rem';
                doc.createStyleSheet("javascript:style");
            }else{
                // 其他标准浏览器写法
                var style = doc.createElement('style');
                style.id = 'rem';
                style.type = 'text/css';
                style.innerHTML="html{font-size:" + fontSize + "px;}";
                doc.getElementsByTagName('HEAD').item(0).appendChild(style);
            }
        }
     if (!doc.addEventListener){
         return;
     }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window, document)

// 3 
html{font-size:10px}
@media screen and (min-width:321px) and (max-width:375px){html{font-size:11px}}
@media screen and (min-width:376px) and (max-width:414px){html{font-size:12px}}
@media screen and (min-width:415px) and (max-width:639px){html{font-size:15px}}
@media screen and (min-width:640px) and (max-width:719px){html{font-size:20px}}
@media screen and (min-width:720px) and (max-width:749px){html{font-size:22.5px}}
@media screen and (min-width:750px) and (max-width:799px){html{font-size:23.5px}}
@media screen and (min-width:800px){html{font-size:25px}}

// 参考地址： https://www.cnblogs.com/well-nice/p/5509589.html https://www.cnblogs.com/webBlog-gqs/p/9139241.html
```