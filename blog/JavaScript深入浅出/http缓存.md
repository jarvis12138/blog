
login.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div>login</div>

<!-- 
    <script>
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://127.0.0.1:8887');
        xhr.send();
    </script>
 -->


    <!-- <script src="http://127.0.0.1:8887"></script> -->
    <script src="./script.js"></script>



</body>
</html>
```

script.js

```javascript
console.log('123');
```

server.js

```javascript
const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
    console.log('request come: ', request.url);

    if (request.url === '/') {
        const html = fs.readFileSync('login.html', 'utf8');
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        response.end(html);
    }

    if (request.url === '/script.js') {
        response.writeHead(200, {
            'Content-type': 'text/javascript',
            'Cache-Control': 'max-age=2000'
        });
        response.end('console.log("load")');
    }

    
    
}).listen(8888);

console.log('server listening on 8888');
```

server2.js

```javascript
const http = require('http');

http.createServer(function (request, response) {
    console.log('request come: ', request.url);

    response.writeHead(200, {
        // 允许跨域
        'Access-Control-Allow-Origin': '*'
    });

    response.end('123');
}).listen(8887);

console.log('server listening on 8887');
```

