
```
iview版本：Tag:v0.9.7
```

[components/affix/affix.vue位置](https://github.com/iview/iview/commit/7fa943eb39bf95004a9c06729b3ccec475d79c96#diff-7edfd28593876949478f2c626cd91ba6)

```javascript
function getScroll(target, top) {
    // 获取滚动高度可以使用 scrollTop 或者 pageYOffset
    // IE6/7/8：包含（doctype）
    // window.pageYOffset：undefined
    // document.documentElement.scrollTop:100
    // document.body.scrollTop：0
    // IE6/7/8：不包含（doctype）
    // window.pageYOffset：undefined
    // document.documentElement.scrollTop:0
    // document.body.scrollTop：100

    // Safari/Chrome:
    // window.pageYOffset：100
    // document.documentElement.scrollTop:0
    // document.body.scrollTop：100

    // Firefox/Opera：（包含doctype）:
    // window.pageYOffset：100
    // document.documentElement.scrollTop:100
    // document.body.scrollTop：0
    // Firefox/Opera：（不包含doctype）
    // window.pageYOffset：100
    // document.documentElement.scrollTop:0
    // document.body.scrollTop：100

    const prop = top ? 'pageYOffset' : 'pageXOffset';
    const method = top ? 'scrollTop' : 'scrollLeft';

    let ret = target[prop];
    if (typeof ret !== 'number') {
        ret = window.document.documentElement[method];
    }
    return ret;
}
```

```javascript
// 在 jQuery JavaScript Library v1.6 版本中 8765行
win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                    jQuery.support.boxModel && win.document.documentElement[ method ] ||
                        win.document.body[ method ] :
                    elem[ method ];

```

```javascript
function getScroll(target, top) {
    const element = target ? target : "window";
    const prop = top ? top : "pageYOffset";
    const method = top ? top : "scrollTop";

    if (element === "window") {
        return ("pageXOffset" in window) ? window[prop] : window.document.documentElement[method] || window.document.body[method];
    } else {
        return element[method];
    }
}
```
