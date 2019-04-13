
```sh
    server {
        listen       80;
        server_name  med.test.com;


        location / {
            index  index.html index.htm;
            proxy_pass http://localhost:8010;
            # proxy_pass http://127.0.0.1:8010;
            rewrite ^/([a-z]+)$ /$1.html;
        }

        location /if {
             proxy_pass https://med.ryeex.com;
            #  proxy_pass http://192.168.50.193:8091;
        }

        location ~* \.(gif|jpg|jpeg|png|css|js|ico|eot|otf|fon|font|ttf|ttc|woff|woff2)$ {
            # 
        }

        #error_page  404              /404.html;
        
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

```
