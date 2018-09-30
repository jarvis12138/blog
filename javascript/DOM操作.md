### getBoundingClientRect

```
兼容IE5+

Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。

当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，top和left属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给top、left属性值加上当前的滚动位置（通过window.scrollX和window.scrollY），这样就可以获取与当前的滚动位置无关的值。

为了跨浏览器兼容，请使用 window.pageXOffset 和 window.pageYOffset 代替 window.scrollX 和 window.scrollY。

MDN文档地址：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
```

### offsetHeight

```
兼容IE5+

HTMLElement.offsetHeight 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数。

通常，元素的offsetHeight是一种元素CSS高度的衡量标准，包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），不包含:before或:after等伪类元素的高度。

对于文档的body对象，它包括代替元素的CSS高度线性总含量高。浮动元素的向下延伸内容高度是被忽略的。

这个属性值会被四舍五入为整数值，如果你需要一个浮点数值，请用 element.getBoundingClientRect().

MDN地址：https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetHeight
```

### clientHeight

```
兼容IE5+

注：在IE5、6、7中如果Element元素没有CSS样式，那么clientHeight值为0。你可以设置任意一个CSS样式即使width也行！

这个属性是只读属性，对于没有定义CSS或者内联布局盒子的元素为0，否则，它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。

clientHeight 可以通过 CSS height + CSS padding - 水平滚动条高度 (如果存在)来计算.

MDN地址：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight
```

### scrollHeight

```
兼容IE5+

Element.scrollHeight 这个只读属性是一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。

scrollHeight 的值等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度。 

没有垂直滚动条的情况下，scrollHeight值与元素视图填充所有内容所需要的最小值clientHeight相同。包括元素的padding，但不包括元素的border和margin。scrollHeight也包括 ::before 和 ::after这样的伪元素。

属性将会对值四舍五入取整。如果需要小数值，使用Element.getBoundingClientRect().

MDN地址：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight
```