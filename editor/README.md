

# 步骤流程

参考：[张鑫旭](https://www.zhangxinxu.com/wordpress/2011/04/js-range-html%E6%96%87%E6%A1%A3%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9%E9%80%89%E4%B8%AD%E3%80%81%E5%BA%93%E5%8F%8A%E5%BA%94%E7%94%A8%E4%BB%8B%E7%BB%8D/)

1、获取 `selection` 

```javascript
var userSelection;
if (window.getSelection) { //现代浏览器
    userSelection = window.getSelection();
    selectedText = userSelection.toString();
} else if (document.selection) { // 老IE浏览器
    userSelection = document.selection.createRange();
    selectedText = userSelection.text;
}
```

由于兼容性的问题， `IE` 浏览器吃 `IE` 的包子，其他浏览器吃 `Mozilla` 的馒头。

在 `Mozilla` 、 `Safari` 、 `Opera` 下上面的 `userSelection` 是个 `Selection` 对象，而在 `IE` 下则是 `Text Range` 对象。这种差异会影响到你后面的脚本： `Internet Explorer` 的 `Text Ranges` 完全不同于 `Mozilla` 的 `Selection` 或是 `W3C` 的 `Range` 对象，你需要分别为 `IE` 和其他浏览器写两套不同的脚本。

需要注意脚本书写的顺序： `Mozilla` `Selection`需放在前面。原因在于 `Opera` 支持两种对象，如果你使用 `window.getSelection()` 去读取用户选择的内容， `Opera` 会创建一个 `Selection` 对象；而使用 `document.selection` 则会创建一个 `Text Range` 对象。

2、获取range范围

```javascript
var getRangeObject = function(selectionObject) {
    if (selectionObject.getRangeAt)
        return selectionObject.getRangeAt(0);
    else { // 较老版本Safari!
        var range = document.createRange();
        range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
        range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
        return range;
    }
};
var rangeObject = getRangeObject(userSelection);
```

在 `IE` 浏览器下， `userSelection` 是 `Text Range` ，在现代浏览器下， `userSelection` 仍然是 `Selection` 对象。

