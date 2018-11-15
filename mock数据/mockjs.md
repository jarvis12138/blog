

### 在vue-cli搭建的项目中使用mockjs

```javascript
npm install mockjs --save-dev

<script src="http://mockjs.com/dist/mock.js"></script>

// 在src目录下新建 mock.js (App.vue同级)

//引入mockjs
const Mock = require('mockjs')
//使用mockjs模拟数据
Mock.mock('/api/data', (req, res) => {
    return {
        code: 0,
        data: ['a','b']
    }
})

// 在main.js中引入
require('./mock')//此部分引入的是我们所编写的mockjs文档

```

[mock.js](http://mockjs.com/0.1/#Basics)

