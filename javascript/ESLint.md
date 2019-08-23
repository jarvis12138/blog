
# ESLint

### 前世今生

> 在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。— by wikipedia

在JavaScript的历史进程中，有三款比较著名的JS Linter工具：**JSLint**、**JSHint**、**ESLint** 

JSLint 可以说是最早出现的 JavaScript 的 lint 工具，由 Douglas Crockford (《JavaScript 语言精粹》作者) 开发。从《JavaScript 语言精粹》的笔风就能看出，Douglas 是个眼里容不得瑕疵的人，所以 JSLint 也继承了这个特色，JSLint 的所有规则都是由 Douglas 自己定义的，可以说这是一个极具 Douglas 个人风格的 lint 工具，如果你要使用它，就必须接受它所有规则。值得称赞的是，JSLint 依然在更新，而且也提供了 node 版本：node-jslint。

由于 JSLint 让很多人无法忍受它的规则，感觉受到了压迫，所以 Anton Kovalyov (现在在 Medium 工作) 基于 JSLint 开发了 JSHint。JSHint 在 JSLint 的基础上提供了丰富的配置项，给了开发者极大的自由，JSHint 一开始就保持着开源软件的风格，由社区进行驱动，发展十分迅速。早期 jQuery 也是使用 JSHint 进行代码检查的，不过现在已经转移到 ESLint 了。

ESLint 由 Nicholas C. Zakas (《JavaScript 高级程序设计》作者) 于2013年6月创建，它的出现因为 Zakas 想使用 JSHint 添加一条自定义的规则，但是发现 JSHint 不支持，于是自己开发了一个。

ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。

ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让ESLint 成为最快支持 ES6 语法的 lint 工具。

### 开始使用

在项目中安装ESLint：

```js
npm install eslint -D
```

初始化 ESLint 配置：

```js
.\node_modules\.bin\eslint --init
```

会生成一个 `.eslintrc.js` 文件。

```js
// .eslintrc.js 配置信息讲解
module.exports = {
    // "root": true, //标识当前配置文件为eslint的根配置文件，让其停止在父级目录中继续寻找。
    // "parser": "babel-eslint", // 解析器
    "env": { // 配置环境：浏览器、node、es6
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended", // 规则继承 配置js风格
    "globals": { // 全局变量
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": { // 指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": { // 设置规则
        // "semi": "off" // 禁止使用分号
    }
};
```

配置优先级问题：
在ESLint配置中，你既可以写在 `.eslintrc.js` 中也可以写在 `package.json` 中等等。

```js
// ESLint 源码可以看到，其配置文件的优先级如下：
const configFilenames = [
    ".eslintrc.js", // 优先级最高
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json",
    ".eslintrc",
    "package.json"
];
```

好了，测试一下刚才的配置。新建 `./src/index.js` 

执行

```js
npx eslint .\src\index.js
```


[参考](https://mp.weixin.qq.com/s?__biz=MzA5MjQ0Mjk2NA==&mid=2247484785&idx=1&sn=6e1b0c11764a6d5ecd627c4f47a97a2b&chksm=906c5d4aa71bd45cb2453e9cc53491f1c009ef79e023fae290bbfb8368d1d7720f4ffd788976&scene=21#wechat_redirect)



