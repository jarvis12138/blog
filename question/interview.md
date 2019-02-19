
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

### var、let、const

```
var: 函数作用域、变量提升
let: 块级作用域、不存在变量提升
const: 一旦声明不能修改，而且必须立即初始化。块级作用域、不存在变量提升、对复合类型的数据只能保证指针是固定的

参考：阮一峰 ECMAScript 6 入门 http://es6.ruanyifeng.com/#docs/let
```

### 获取浏览器可视区宽度

```javascript
var htmlWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
// 获取的是整个浏览器的可视区
// 如果有滚动条，则宽度减去17px
// IE8及其以下老版本会少3px
```

### 函数与继承

```javascript
function SuperType() {
    this.name = ['zhangsan', 'lisi'];
}
SuperType.prototype = {
    constructor: SuperType,
    sayName: function() {
        alert(this.name);
    }
};

SuperType(); // name变量在window上,即window.name
new SuperType(); // 每个new后的变量单独有name
SuperType().sayName(); // 报错
new SuperType().sayName(); // 输出name

function SubType() {}
SubType.prototype = new SuperType();
new SubType().sayName(); // 会共用this.name
```

### 闭包

```
闭包的概念
各种专业文献上的"闭包"（closure）定义非常抽象，很难看懂。我的理解是，闭包就是能够读取其他函数内部变量的函数。
由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。
所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

闭包的用途
闭包可以用在许多地方。它的最大用处有两个，一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。
```

```javascript
function f2() {
    var n = 999;
    nAdd = function () {n+=1;}
    function f2() {
        alert(n);
    }
    return f2;
}
var result = f1();
result(); // 999
nAdd();
result(); // 1000

// 在这段代码中，result实际上就是闭包f2函数。它一共运行了两次，第一次的值是999，第二次的值是1000。这证明了，函数f1中的局部变量n一直保存在内存中，并没有在f1调用后被自动清除。

// 为什么会这样呢？原因就在于f1是f2的父函数，而f2被赋给了一个全局变量，这导致f2始终在内存中，而f2的存在依赖于f1，因此f1也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。

// 这段代码中另一个值得注意的地方，就是"nAdd=function(){n+=1}"这一行，首先在nAdd前面没有使用var关键字，因此nAdd是一个全局变量，而不是局部变量。其次，nAdd的值是一个匿名函数（anonymous function），而这个匿名函数本身也是一个闭包，所以nAdd相当于是一个setter，可以在函数外部对函数内部的局部变量进行操作。
```

```javascript
// 例子：
var name = "The window";
var object = {
    name: "My Object",
    getName: function () {
        return function () {
            return this.name;
        };
    }
};
alert(object.getName()()); // "The window";
// object.getName() 会产生闭包，而之后this指向window
```

### getComputedStyle

```javascript
// jQuery JavaScript Library v1.12.4

var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}
```

```javascript
function getStyle(element, css){
  var elementStyle = window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle;
  var elementCss = elementStyle.getPropertyValue ? elementStyle.getPropertyValue(css) : elementStyle.getAttribute(css);   // getPropertyValue、getAttribute都支持 "background-color" 写法（不考虑IE6）

  return elementCss;
}
```



