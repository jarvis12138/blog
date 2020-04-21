
# Vue 模板编译

代码位于 `./src/compiler/parser` 

在其测试中 `./test/unit/modules/compiler/compiler-options.spec.js` ，测试 `<h1>hello world</h1>` 
<!-- 在其测试中 `./test/unit/modules/compiler/compiler-options.spec.js`  -->

（为了调试方便，可以建一个 `html` 文件引入 `vue2.0.1` ， `new Vue({})` 后将断点打在函数 `parse` 处）

执行

```js
parse(template, options) {
  parseHTML(template, options);
  // ...
  return root;
}
```

通过 `parse` 函数，最终会将 `HTML` 字符串

```html
<div id="app">
  <h1>hello world</h1>
</div>
```

转换成 `AST` 

```js
{
  "attrsList": [],
  "attrsMap": {},
  "children": [{
    "text": "hello world",
    "type": 3
  }],
  "parent": {
    "attrs": [{"name": "id", "value": "app"}],
    "attrsList": [{"name": "id", "value": "app"}],
    "attrsMap": {"id": "app"},
    "children": [], // 本身
    "parent": undefined,
    "plain": false,
    "tag": "div",
    "type": 1
  },
  "plain": true,
  "tag": "h1",
  "type": 1
}
```

我们的 `.vue` 文件会进行如上解析。

以

```js
template: '<h1>hello world</h1>'
```

为例：

```js
function parseHTML (html, options) {
    while (html) {
      // 对字符串逐个进行正则匹配

      // 判断：1、是否是注释 当是注释标签的时候，不予操作，直接执行 advance 函数向后推进
      // 2、是否是开始标签 当是开始标签时，则推入 stack 栈，并且执行 start 钩子函数
      // 3、是否是结束标签 结束标签内的执行逻辑有点复杂，需要先判断 stack 栈中是否有与之对应的开始标签，如果有则调用 end 钩子函数；如果没有则什么都不执行；如果是如 <br /> 这种自闭和标签则调用 start 钩子函数；如果是 <p> 标签则调用 start 和 end 钩子函数
    }
}
```

初始化中的变量 `stack` 为标签存储堆栈。假如有 `html` 字符串： `<div><p>test</p></div>` ，在编译的时候从左往右遍历字符串，发现 `<div>` 则push进堆栈 `[<div>]` ，再有 `<p>` 推入 `[<div>, <p>]` ，在发现结束标签 `</p>` 后取出堆栈顶部的标签（即为p标签），组成 `<p></p>` 就可以创建DOM了。

这样就可以检测编写的 `html` 字符串是否缺少某个闭合标签，导致编译错误。

 `lastTag` 存储 `stack` 顶部的标签。

 `isUnaryTag` 说明是否为一元标签，如 `<br />` 。

进入 `while` 循环

```js
while (html) {
  // .vue 文件一般包含三个部分: <template></template> <script></script> <style></style>
  // isSpecialTag: 标签不能是 script 、 style
  if (!lastTag || !isSpecialTag(lastTag)) {

  } else {
    // 当堆栈顶部是 script 、 style 标签时执行
    html.replace(reStackedTag, function (){}) // 如：当标签是 style 时，遍历字符串直到出现 </style> 字样闭合标签，中间的部分强制为字符串，调用 chars 钩子函数。
    parseEndTag(); // 结束标签
  }
}
```

 `textEnd` 找寻到 `<` 字符的位置，大于0表示 `0 ~ textEnd` 位置都是字符串。

接下来判断是否为 `Comment` 、 `<!--[if !IE]>-->` 、 `Doctype` 注释标签，直接越过这些字符串不编译。

```js
// 当为开始标签时
const startTagMatch = parseStartTag()
```

生成数据结构

```js
const match = {
  tagName: start[1],
  attrs: [],
  start: index
}
```

进入 `handleStartTag` 函数

对于 p 标签有一些特殊处理，以期模仿浏览器行为。

```js
lastTag === 'p' && isNonPhrasingTag(tagName)
```

最近一次遇到的开始标签是p标签，并且当前正在解析的开始标签必须不能是段落式内容(Phrasing content)模型，这时候if语句块的代码才会执行，即调用parseEndTag(lastTag)。

首先大家要知道每一个html元素都拥有一个或多个内容模型(content model)，其中p标签本身的内容模型是流式内容(Flow content)，并且p标签的特性是只允许包含段落式内容(Phrasing content)。所以条件成立的情况如下：

```html
<p><h1></h1></p>
```

在解析上面这段html字符串的时候，首先遇到p标签的开始标签，此时lastTag被设置为p，紧接着会遇到h1标签的开始标签，由于h1标签的内容模型属于非段落式内容(Phrasing content)模型，所以会立即调用parseEndTag(lastTag)函数闭合p标签，此时由于强行插入了</p> 标签，所以解析后的字符串将变为如下内容：

```html
<p></p><h2></h2></p>
```

接着，继续解析该字符串，会遇到<h2></h2>标签并正常解析之，最后解析器会遇到一个单独的p标签的结束标签，即：</p>。这个时候就回到了我们前面讲过的，当解析器遇到p标签或者br标签的结束标签时会补全他们，最终<p><h2></h2></p> 这段html字符串将被解析为：

```html
<p></p><h2></h2><p></p>
```

而这也就是浏览器的行为。以上是第一个if分支的意义。还有第二个if分支，它的条件如下：

```js
canBeLeftOpenTag(tagName) && lastTag === tagName
```

以上条件成立的意思是：当前正在解析的标签是一个可以省略结束标签的标签，并且与上一次解析到的开始标签相同，如下：

```html
<p>max
<p>kaixin
```

p标签是可以省略结束标签的标签，所以当解析到一个p标签的开始标签并且下一次遇到的标签也是p标签的开始标签时，会立即关闭第二个p标签。即调用：parseEndTag(tagName) 函数，然后由于第一个p标签缺少闭合标签所以会Vue会给你一个警告。

```js
// 对数据结构 match 的 attrs 字段进行处理
// 如：<h1 id="box">hello world</h1> => attrs:[{"name": "id","value": "box"}]
for (let i = 0; i < l; i++) {
  const args = match.attrs[i]
  // ...
}
```

最后，调用 `start` 钩子函数。

对闭合标签操作 `parseEndTag` 

就像开头的例子 `<div><p>test</p></div>` ，经过 `<div><p>` 后， `stack` 内已经存储了 `[<div>,<p>]` ，当遇到闭合标签 `</p>` 会遍历 `stack` 数组，查找是否有 `<p>` 开始标签。

如果找到则可以调用 `end` 钩子函数， `stack` 数组的长度也要变为 `pos` ，这里有个隐藏的处理，如果字符串为 `<div><p><h1>test</p></div>` ， `stack` 数组就会多一个元素 `<h1>` ，此时就会被丢弃。如果遇到 `<div>test</p></div>` 这种找不到开始标签的，那么就丢弃这个闭合标签。

合并一下，所有情况为 `</p>` 闭合标签，可能在 `stack` 的中间、最后位置找到开始标签 `<p>` ，或者直接就找不到开始标签。

```js
// 对p标签的处理上面已经介绍了，就不再赘诉
else if (tagName.toLowerCase() === 'p') {}
```

 `while` 循环结束后，还会再执行一次 `parseEndTag` 函数

```js
// Clean up any remaining tags
parseEndTag()
```

因为当前只是将 `html` 字符串遍历完成， `stack` 数组内可能还有多余的标签，比如这种情况

```html
<div><div><p>test</p></div>
```

这时 `pos = 0` ，遍历剩余的 `stack` 数组，调用钩子 `end` ，最后直接将 `stack` 数组置空。

上面只介绍了 `parseHTML` 函数对 `html` 字符串处理的代码逻辑，下面解析如何通过 `start` 、 `end` 、 `chars` 钩子函数将 `html` 字符串转换成 `AST` 。

在 `start` 钩子中，每发现一个开始标签就生成一个 `ASTElement` 

```js
const element: ASTElement = {
  type: 1,
  tag,
  attrsList: attrs,
  attrsMap: makeAttrsMap(attrs),
  parent: currentParent,
  children: []
}
```

接下来的 `processPre、processRawAttrs、processFor、processIf、processOnce、processKey、processRef、processSlot、processComponent、processAttrs` 是对标签中 `vue` 自定义属性（v-if、v-for等）的处理，暂时略过...

```js
if (!root) {
  root = element
}
```

这样，在 `return root` 的时候就可以返回 `AST` 树了。

现在，已经可以将各个 `html` 标签转换成特定的数据结构了。但是谁是谁的父级、谁是谁的子级，层级关系该如何确定呢？

测试 `<div id="box"><h2><h1>hello world</h1></div>` 字符串。

```js
const element: ASTElement = {
  // type: 1,
  // tag,
  // attrsList: attrs,
  // attrsMap: makeAttrsMap(attrs),
  parent: currentParent, // 父级元素为 stack 顶部元素
  children: []
}
```

```js
if (!unary) {
  currentParent = element
  stack.push(element)
}
```

 `stack` 堆栈存储下开始标签 `[<div>,<h2>,<h1>]` ， `currentParent` 每次都为 `stack` 堆栈最顶端的标签。

当解析到闭合标签 `</h1>` 时，调用 `end` 钩子。

```js
stack.length -= 1 // 删除顶部一个标签
currentParent = stack[stack.length - 1]
```

当解析到 `</div>` 时， `parse` 函数中的 `stack` 还有 `[<div>,<h2>]` ，调用 `parseHTML` 的 `parseEndTag` ，变量 `pos = 0` 

```js
// stack 内还有 [<div>,<h2>] ，就会调用两次 end 钩子函数，也即在缺闭合标签的情况下 vue 会补齐
for (let i = stack.length - 1; i >= pos; i--) {
  if (options.end) {
    options.end(stack[i].tag, start, end)
  }
}
```

 `return root` 为：

```js
{
  // ...
  "tag": "div",
  "children": [{
    "tag": "h2",
    "children": [{
      "tag": "h1",
      "children": [{
        "text": "hello world"
      }]
    }]
  }]
}
```

在单独看看 `Vue` 自定义属性，以 `processFor` 为例：

```js
exp = getAndRemoveAttr(el, 'v-for') // 获取 v-for 里的内容
```

再通过正则 `forAliasRE = /(.*)\s+(?:in|of)\s+(.*)/` 匹配。以 `v-for="(item, index) in list"` 为例

```js
exp.match(forAliasRE)
```

输出:

```js
{
  "0": "(item, index) in list",
  "1": "(item, index)",
  "2": "list",
  "groups": undefined,
  "index": 0,
  "input": "(item, index) in list"
}
```

下面继续拆分 `(item, index)` ，最终 `ASTElement` 为：

```js
{
  // ...
  "alias": "item",
  "for": "list",
  "iterator1": "index"
}
```

到这里 `./src/compiler/parser` 分析完了...

在 `./src/compiler` 中还有一个 `optimizer.js` 进行静态标注。像 `<div>hello world</div>` 这样的静态节点不会变化无需重新渲染， `<div v-for="item in list"></div>` 则一旦数据变化就需要重新渲染；特殊标记下后就可以减少一些不必要的元素渲染了。

```js
function compile() {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}
```

 `markStatic(root)` 对节点进行标注，递归循环所有父子 `ASTElement` 

 `type` 为 `3` 是纯文本 `如: hello world` ，值为 `2` 时是expression文本 `如: {{hello world}}` 

```js
return !!(node.pre || (
  !node.hasBindings && // no dynamic bindings
  !node.if && !node.for && // not v-if or v-for or v-else
  !isBuiltInTag(node.tag) && // not a built-in
  isPlatformReservedTag(node.tag) && // not a component
  Object.keys(node).every(isStaticKey)
))
```

当不是 `pre` 标签或者（标签中不包含以下属性：不包含动态bind、不包含if、不包含for、不是built-in、不是component、节点都是静态节点）时，返回 `true` 。

 `markStaticRoots(root, false)` 标注静态根节点。

一个节点要想成为静态根节点， `node.once || node.static` 为 `true` 。

此时我们终于将 `html` 字符串转换成 `AST` 了，调用 `generate` 。

```js
function generate() {
  // ...
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: currentStaticRenderFns
  }
}
```

 `genData` 函数是一些对标签属性的处理

用 `<div><h1>hello world</h1></div>` 测试，返回

```js
{
  "render": "with(this){return _m(0)}",
  "staticRenderFns": ["with(this){return _h('div',[_h('h1',["hello world"])])}"]
}
```

用 `<div><h1>{{hello world}}</h1></div>` 测试，返回

```js
{
  "render": "with(this){return _h('div',[_h('h1',[_s(hello world)])])}",
  "staticRenderFns": []
}
```

在 `Vue` 中，可以不使用 `template` 模板，直接使用 `render` 函数生成，参考官网 `https://cn.vuejs.org/v2/guide/render-function.html` 

```js
//  el 都是没有 staticProcessed 标记的，当 staticRoot 为 true 时添加上
if (el.staticRoot && !el.staticProcessed) {
  // hoist static sub-trees out
  el.staticProcessed = true
  staticRenderFns.push(`with(this){return ${genElement(el)}}`)
  return `_m(${staticRenderFns.length - 1}${el.staticInFor ? ',true' : ''})`
}
```

```js
{
  // component or element
  let code
  if (el.component) {
    code = genComponent(el)
  } else {
    const data = genData(el)
    const children = el.inlineTemplate ? null : genChildren(el)
    code = `_h('${el.tag}'${
      data ? `,${data}` : '' // data
    }${
      children ? `,${children}` : '' // children
    })`
  }
  // module transforms
  for (let i = 0; i < transforms.length; i++) {
    code = transforms[i](el, code)
  }
  return code
}
```

当 `el` 不是 `component` 时，获取 `el` 的属性，有子元素则继续递归。

然后生成 `_h("标签名 el.tage","属性对应的数据对象 data","子级虚拟节点 children ");` 格式。

中间是对 `Vue` 自定义属性的操作。

至此 `vue`  `compiler` 完成了从 `字符串模板` 到 `AST` 到 `render` 的过程。
