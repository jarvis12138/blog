
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

### jQuery getStyle

```js
'use strict';

// jQuery JavaScript Library v1.12.4 http://jquery.com/
function getStyle(elem, name, computed) {
    var getStyles, curCSS,
        rposition = /^(top|right|bottom|left)$/;
    var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
    var rmargin = (/^margin/);

    if (window.getComputedStyle) {
        getStyles = function (elem) {

            // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
            // IE throws on elements created in popups
            // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
            var view = elem.ownerDocument.defaultView;

            if (!view || !view.opener) {
                view = window;
            }

            return view.getComputedStyle(elem);
        };

        curCSS = function (elem, name, computed) {
            var width, minWidth, maxWidth, ret,
                style = elem.style;

            computed = computed || getStyles(elem);

            // getPropertyValue is only needed for .css('filter') in IE9, see #12537
            ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

            // Support: Opera 12.1x only
            // Fall back to style even without computed
            // computed is undefined for elems on document fragments
            // 如果通过getComputedStyle获取的样式为“”空字符串，并且元素没有在文档中（例如，通过document.createElement(tagName)创建的元素还没有添加到body中）时，通过style方式获取样式，这样在元素的样式时通过内联方式设置的时候，没有添加到文档中，也可以获取到样式值。
            // if ((ret === "" || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
            //     ret = jQuery.style(elem, name);
            // }

            if (computed) {

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value"
                // instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values,
                // but width seems to be reliably pixels
                // this is against the CSSOM draft spec:
                // http://dev.w3.org/csswg/cssom/#resolved-values
                if (!pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

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
    } else if (document.documentElement.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };

        curCSS = function (elem, name, computed) {
            var left, rs, rsLeft, ret,
                style = elem.style;

            computed = computed || getStyles(elem);
            ret = computed ? computed[name] : undefined;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if (ret == null && style && style[name]) {
                ret = style[name];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are
            // proportional to the parent element instead
            // and we can't measure the parent instead because it
            // might trigger a "stacking dolls" problem
            if (rnumnonpx.test(ret) && !rposition.test(name)) {

                // Remember the original values
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
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

    return {
        'getStyles': getStyles,
        'curCSS': curCSS
    };
}

function pixelMarginRight() {
    var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
        reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
        container = document.createElement("div"),
        div = document.createElement("div");
    var support = {};

    // Finish early in limited (non-browser) environments
    if (!div.style) {
        return;
    }

    div.style.cssText = "float:left;opacity:.5";

    // Support: IE<9
    // Make sure that element opacity exists (as opposed to filter)
    support.opacity = div.style.opacity === "0.5";

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    support.cssFloat = !!div.style.cssFloat;

    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";

    container = document.createElement("div");
    container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
        "padding:0;margin-top:1px;position:absolute";
    div.innerHTML = "";
    container.appendChild(div);

    // Support: Firefox<29, Android 2.3
    // Vendor-prefix box-sizing
    support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
        div.style.WebkitBoxSizing === "";

    function computeStyleTests() {
        var contents, divStyle,
            documentElement = document.documentElement;

        // Setup
        documentElement.appendChild(container);

        div.style.cssText =

            // Support: Android 2.3
            // Vendor-prefix box-sizing
            "-webkit-box-sizing:border-box;box-sizing:border-box;" +
            "position:relative;display:block;" +
            "margin:auto;border:1px;padding:1px;" +
            "top:1%;width:50%";

        // Support: IE<9
        // Assume reasonable values in the absence of getComputedStyle
        pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
        pixelMarginRightVal = reliableMarginRightVal = true;

        // Check for getComputedStyle so that this code is not run in IE<9.
        if (window.getComputedStyle) {
            divStyle = window.getComputedStyle(div);
            pixelPositionVal = (divStyle || {}).top !== "1%";
            reliableMarginLeftVal = (divStyle || {}).marginLeft === "2px";
            boxSizingReliableVal = (divStyle || { width: "4px" }).width === "4px";

            // Support: Android 4.0 - 4.3 only
            // Some styles come back with percentage values, even though they shouldn't
            div.style.marginRight = "50%";
            pixelMarginRightVal = (divStyle || { marginRight: "4px" }).marginRight === "4px";

            // Support: Android 2.3 only
            // Div with explicit width and no margin-right incorrectly
            // gets computed margin-right based on width of container (#3333)
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            contents = div.appendChild(document.createElement("div"));

            // Reset CSS: box-sizing; display; margin; border; padding
            contents.style.cssText = div.style.cssText =

                // Support: Android 2.3
                // Vendor-prefix box-sizing
                "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
            contents.style.marginRight = contents.style.width = "0";
            div.style.width = "1px";

            reliableMarginRightVal =
                !parseFloat((window.getComputedStyle(contents) || {}).marginRight);

            div.removeChild(contents);
        }

        // Support: IE6-8
        // First check that getClientRects works as expected
        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        div.style.display = "none";
        reliableHiddenOffsetsVal = div.getClientRects().length === 0;
        if (reliableHiddenOffsetsVal) {
            div.style.display = "";
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            div.childNodes[0].style.borderCollapse = "separate";
            contents = div.getElementsByTagName("td");
            contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
            reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            if (reliableHiddenOffsetsVal) {
                contents[0].style.display = "";
                contents[1].style.display = "none";
                reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            }
        }

        // Teardown
        documentElement.removeChild(container);
    }

    // Support: Android 4.0-4.3
    if (pixelPositionVal == null) {
        computeStyleTests();
    }
    return pixelMarginRightVal;

}

// getStyle
```

```javascript
function getStyle(element, css){
  var elementStyle = window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle;
  var elementCss = elementStyle.getPropertyValue ? elementStyle.getPropertyValue(css) : elementStyle.getAttribute(css);   // getPropertyValue、getAttribute都支持 "background-color" 写法（不考虑IE6）

  return elementCss;
}
```

### 页面元素位置

[参考地址：阮一峰博客](http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html)

**一、获取网页的大小**

网页上的每个元素，都有clientHeight和clientWidth属性。这两个属性指元素的内容部分再加上padding的所占据的视觉面积，不包括border和滚动条占用的空间。

因此，document元素的clientHeight和clientWidth属性，就代表了网页的大小。

```js
function getViewport(){
    if (document.compatMode == "BackCompat"){
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}
```

上面的getViewport函数就可以返回浏览器窗口的高和宽。使用的时候，有三个地方需要注意：

1）这个函数必须在页面加载完成后才能运行，否则document对象还没生成，浏览器会报错。

2）大多数情况下，都是document.documentElement.clientWidth返回正确值。但是，在IE6的quirks模式中，document.body.clientWidth返回正确的值，因此函数中加入了对文档模式的判断。

3）clientWidth和clientHeight都是只读属性，不能对它们赋值。

**二、获取网页大小的另一种方法**

网页上的每个元素还有scrollHeight和scrollWidth属性，指包含滚动条在内的该元素的视觉面积。

那么，document对象的scrollHeight和scrollWidth属性就是网页的大小，意思就是滚动条滚过的所有长度和宽度。

仿照getViewport()函数，可以写出getPagearea()函数。

```js
　　function getPagearea(){
　　　　if (document.compatMode == "BackCompat"){
　　　　　　return {
　　　　　　　　width: document.body.scrollWidth,
　　　　　　　　height: document.body.scrollHeight
　　　　　　}
　　　　} else {
　　　　　　return {
　　　　　　　　width: document.documentElement.scrollWidth,
　　　　　　　　height: document.documentElement.scrollHeight
　　　　　　}
　　　　}
　　}
```

但是，这个函数有一个问题。如果网页内容能够在浏览器窗口中全部显示，不出现滚动条，那么网页的clientWidth和scrollWidth应该相等。但是实际上，不同浏览器有不同的处理，这两个值未必相等。所以，我们需要取它们之中较大的那个值，因此要对getPagearea()函数进行改写。

```js
　　function getPagearea(){
　　　　if (document.compatMode == "BackCompat"){
　　　　　　return {
　　　　　　　　width: Math.max(document.body.scrollWidth,
　　　　　　　　　　　　　　　　document.body.clientWidth),
　　　　　　　　height: Math.max(document.body.scrollHeight,
　　　　　　　　　　　　　　　　document.body.clientHeight)
　　　　　　}
　　　　} else {
　　　　　　return {
　　　　　　　　width: Math.max(document.documentElement.scrollWidth,
　　　　　　　　　　　　　　　　document.documentElement.clientWidth),
　　　　　　　　height: Math.max(document.documentElement.scrollHeight,
　　　　　　　　　　　　　　　　document.documentElement.clientHeight)
　　　　　　}
　　　　}
　　}
```

**三、获取网页元素的绝对位置**

网页元素的绝对位置，指该元素的左上角相对于整张网页左上角的坐标。这个绝对位置要通过计算才能得到。

首先，每个元素都有offsetTop和offsetLeft属性，表示该元素的左上角与父容器（offsetParent对象）左上角的距离。所以，只需要将这两个值进行累加，就可以得到该元素的绝对坐标。

下面两个函数可以用来获取绝对位置的横坐标和纵坐标。

```js
　　function getElementLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualLeft;
　　}

　　function getElementTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualTop;
　　}
```

由于在表格和iframe中，offsetParent对象未必等于父容器，所以上面的函数对于表格和iframe中的元素不适用。

**四、获取网页元素的相对位置**

网页元素的相对位置，指该元素左上角相对于浏览器窗口左上角的坐标。

有了绝对位置以后，获得相对位置就很容易了，只要将绝对坐标减去页面的滚动条滚动的距离就可以了。滚动条滚动的垂直距离，是document对象的scrollTop属性；滚动条滚动的水平距离是document对象的scrollLeft属性。

对上一节中的两个函数进行相应的改写：

```js
　　function getElementViewLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}

　　　　if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollLeft=document.body.scrollLeft;
　　　　} else {
　　　　　　var elementScrollLeft=document.documentElement.scrollLeft; 
　　　　}

　　　　return actualLeft-elementScrollLeft;
　　}

　　function getElementViewTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　 if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollTop=document.body.scrollTop;
　　　　} else {
　　　　　　var elementScrollTop=document.documentElement.scrollTop; 
　　　　}

　　　　return actualTop-elementScrollTop;
　　}
```

scrollTop和scrollLeft属性是可以赋值的，并且会立即自动滚动网页到相应位置，因此可以利用它们改变网页元素的相对位置。另外，element.scrollIntoView()方法也有类似作用，可以使网页元素出现在浏览器窗口的左上角。

**五、获取元素位置的快速方法**

除了上面的函数以外，还有一种快速方法，可以立刻获得网页元素的位置。

那就是使用getBoundingClientRect()方法。它返回一个对象，其中包含了left、right、top、bottom四个属性，分别对应了该元素的左上角和右下角相对于浏览器窗口（viewport）左上角的距离。

所以，网页元素的相对位置就是

```js
　　var X= this.getBoundingClientRect().left;

　　var Y =this.getBoundingClientRect().top;
```

再加上滚动距离，就可以得到绝对位置

```js
　　var X= this.getBoundingClientRect().left+document.documentElement.scrollLeft;

　　var Y =this.getBoundingClientRect().top+document.documentElement.scrollTop;
```

目前，IE、Firefox 3.0+、Opera 9.5+都支持该方法，而Firefox 2.x、Safari、Chrome、Konqueror不支持。












