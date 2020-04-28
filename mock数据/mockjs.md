
### node 本地 mock 数据

```js
// mock.js
var express = require('express');
var app = express(); // 实例化

// 允许跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});

var user = require('./routes/user.js');
var address = require('./routes/address.js');

app.use('/', user);
app.use('/', address);

app.listen('8090');
```

```js
// watch.js
var nodemon = require('nodemon');

nodemon({
  script: './mock.js',  // 需要重启的入口
  ext: './routes/*.js' // 需要监测变化的文件
});

nodemon.on('start', function () {
  console.log('mock server start');
}).on('quit', function () {
  console.log('mock server quit');
  process.exit();
}).on('restart', function (files) {
  console.log('mock server restart, due to ', files);
});
```

```js
// routes\address.js
var express = require('express');
var mockjs = require('mockjs');
var router = express.Router();

router.all('/get/address', function (req, res) {
  res.json(mockjs.mock({
    'status': 200,
    'data|1-9': [{
      'name': 'addressaa',
      'id|+1': 1,
      'value|0-500': 20
    }]
  }));
});

module.exports = router;
```

```js
// routes\user.js
var express = require('express');
var mockjs = require('mockjs');
var router = express.Router();

router.all('/get/user', function (req, res) {
  res.json(mockjs.mock({
    'status': 200,
    'data|1-9': [{
      'name|5-8': /[a-zA-Z]/,
      'id|+1': 1,
      'value|0-500': 20
    }]
  }));
});

module.exports = router;
```


